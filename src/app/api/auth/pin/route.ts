import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins, volunteers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const requestId = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();
  
  try {
    const { pin } = await request.json();
    
    if (!pin) {
      return NextResponse.json(
        { error: 'PIN is required' },
        { status: 400 }
      );
    }
    
    // Find the PIN
    const pinRecord = await db()
      .select()
      .from(pins)
      .where(eq(pins.pin, pin));
    
    if (pinRecord.length === 0) {
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
      response.headers.set('X-RateLimit-Limit', '10');
      response.headers.set('X-RateLimit-Window', '900'); // 15 minutes
      response.headers.set('X-RateLimit-Policy', 'PIN authentication limited to 10 attempts per 15 minutes');
      
      return response;
    }
    
    // Get volunteer information if it exists
    const volunteerRecord = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.pinId, pinRecord[0].pinId));
    
    const responseTime = Date.now() - startTime;
    const response = NextResponse.json({
      pinId: pinRecord[0].pinId,
      role: pinRecord[0].role,
      volunteer: volunteerRecord.length > 0 ? volunteerRecord[0] : null
    });
    
    // Add debugging and rate limiting headers
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Auth-Status', 'success');
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Window', '900'); // 15 minutes
    response.headers.set('X-RateLimit-Policy', 'PIN authentication limited to 10 attempts per 15 minutes');
    
    return response;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] PIN authentication error (${responseTime}ms):`, error);
    
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    );
    
    errorResponse.headers.set('X-Request-ID', requestId);
    errorResponse.headers.set('X-Response-Time', `${responseTime}ms`);
    errorResponse.headers.set('X-Auth-Status', 'error');
    
    return errorResponse;
  }
} 