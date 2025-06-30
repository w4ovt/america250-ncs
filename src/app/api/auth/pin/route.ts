import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteers } from '../../../../db/schema';
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
      securityLogger.logAuth(requestId, clientIP, userAgent, pin, 'blocked', {
        rateLimited: true,
        attempts: rateLimitResult.limit - rateLimitResult.remaining
      });
      const details = {
        mitigationTaken: 'Request blocked',
        ...(rateLimitResult.blockedUntil && { blockedDuration: rateLimitResult.blockedUntil - Date.now() })
      };
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
    // Authenticate directly against volunteers table
    const volunteerRecord = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.pin, pin));
    if (volunteerRecord.length === 0) {
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
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      response.headers.set('X-Auth-Status', 'failed');
      response.headers.set('X-Client-IP', clientIP);
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      return response;
    }
    // Get the volunteer record (guaranteed to exist)
    const volunteer = volunteerRecord[0];
    const successDetails: Record<string, string | number | undefined> = {
      attempts: rateLimitResult.limit - rateLimitResult.remaining + 1,
      callsign: volunteer?.callsign
    };
    if (typeof volunteer?.volunteerId === 'number') {
      successDetails.volunteerId = volunteer.volunteerId;
    }
    securityLogger.logAuth(requestId, clientIP, userAgent, pin, 'success', successDetails);
    const responseTime = Date.now() - startTime;
    const response = NextResponse.json({
      volunteerId: volunteer?.volunteerId,
      role: volunteer?.role,
      volunteer
    });
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