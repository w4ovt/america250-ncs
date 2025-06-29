import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins, volunteers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { getClientIP, rateLimitPinAuth } from '../../../../lib/rate-limiter';
import { validatePin } from '../../../../lib/input-validation';
import { securityLogger } from '../../../../lib/security-logger';

export async function POST(request: NextRequest) {
  const requestId = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent');
  
  try {
    const body = await request.json();
    
    // Validate PIN input
    const pinValidation = validatePin(body.pin);
    if (!pinValidation.isValid) {
      const responseTime = Date.now() - startTime;
      const response = NextResponse.json(
        { 
          error: 'Invalid PIN format',
          details: pinValidation.error,
          requestId
        },
        { status: 400 }
      );
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Client-IP', clientIP);
      return response;
    }
    
    const { pin } = pinValidation;
    if (!pin) {
      throw new Error('PIN validation succeeded but pin is undefined');
    }
    
    // Apply rate limiting
    const rateLimitResult = rateLimitPinAuth(request, pin);
    if (!rateLimitResult.success) {
      // Log rate limiting incident
      securityLogger.logAuth(requestId, clientIP, userAgent, pin, 'blocked', {
        rateLimited: true,
        attempts: rateLimitResult.limit - rateLimitResult.remaining
      });
      
      const details: Record<string, string | number> = {
        mitigationTaken: 'Request blocked'
      };
      if (rateLimitResult.blockedUntil) {
        details.blockedDuration = rateLimitResult.blockedUntil - Date.now();
      }
      
      securityLogger.logSecurityIncident(
        requestId,
        clientIP,
        'rate_limit',
        `Authentication rate limit exceeded for PIN`,
        'high',
        details
      );
      
      const responseTime = Date.now() - startTime;
      const response = NextResponse.json(
        { 
          error: 'Too many authentication attempts',
          details: rateLimitResult.blocked 
            ? `Temporarily blocked. Try again later.`
            : `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60)} minutes.`,
          requestId,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
      
      // Add rate limit headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Client-IP', clientIP);
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());
      
      if (rateLimitResult.blocked && rateLimitResult.blockedUntil) {
        response.headers.set('X-RateLimit-Blocked-Until', rateLimitResult.blockedUntil.toString());
      }
      
      return response;
    }
    
    // Find the PIN
    const pinRecord = await db()
      .select()
      .from(pins)
      .where(eq(pins.pin, pin));
    
    if (pinRecord.length === 0) {
      // Log failed authentication attempt
      securityLogger.logAuth(requestId, clientIP, userAgent, pin, 'failure', {
        attempts: rateLimitResult.limit - rateLimitResult.remaining + 1
      });
      
      const responseTime = Date.now() - startTime;
      const response = NextResponse.json(
        { 
          error: 'Invalid PIN',
          details: 'Please check your 4-digit PIN and try again',
          requestId
        },
        { status: 401 }
      );
      
      // Add debugging and rate limiting headers for failed attempts
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Auth-Status', 'failed');
      response.headers.set('X-Client-IP', clientIP);
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      
      return response;
    }
    
    // Get the pin record (guaranteed to exist due to length check above)
    const pinData = pinRecord[0];
    if (!pinData) {
      throw new Error('PIN record not found after validation');
    }
    
    // Get volunteer information if it exists
    const volunteerRecord = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.pinId, pinData.pinId));
    
    // Log successful authentication
    const volunteer = volunteerRecord.length > 0 ? volunteerRecord[0] : null;
    const successDetails: Record<string, string | number> = {
      attempts: rateLimitResult.limit - rateLimitResult.remaining + 1
    };
    if (volunteer?.volunteerId) {
      successDetails.volunteerId = volunteer.volunteerId;
    }
    if (volunteer?.callsign) {
      successDetails.callsign = volunteer.callsign;
    }
    
    securityLogger.logAuth(requestId, clientIP, userAgent, pin, 'success', successDetails);
    
    const responseTime = Date.now() - startTime;
    const response = NextResponse.json({
      pinId: pinData.pinId,
      role: pinData.role,
      volunteer
    });
    
    // Add debugging and rate limiting headers
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Auth-Status', 'success');
    response.headers.set('X-Client-IP', clientIP);
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
    
    return response;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${requestId}] PIN authentication error (${responseTime}ms):`, error);
    }
    
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    );
    
    errorResponse.headers.set('X-Request-ID', requestId);
    errorResponse.headers.set('X-Response-Time', `${responseTime}ms`);
    errorResponse.headers.set('X-Auth-Status', 'error');
    errorResponse.headers.set('X-Client-IP', clientIP);
    
    return errorResponse;
  }
} 