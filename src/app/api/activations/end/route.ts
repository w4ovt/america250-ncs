import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const requestId = `end_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();
  
  try {
    const { activationId } = await request.json();
    
    if (!activationId) {
      return NextResponse.json(
        { error: 'Activation ID is required' },
        { status: 400 }
      );
    }
    
    const updatedActivation = await db()
      .update(activations)
      .set({ endedAt: new Date() })
      .where(eq(activations.activationId, activationId))
      .returning();
    
    if (updatedActivation.length === 0) {
      const responseTime = Date.now() - startTime;
      const notFoundResponse = NextResponse.json(
        { error: 'Activation not found', requestId },
        { status: 404 }
      );
      
      notFoundResponse.headers.set('X-Request-ID', requestId);
      notFoundResponse.headers.set('X-Response-Time', `${responseTime}ms`);
      notFoundResponse.headers.set('X-Operation', 'activation-end');
      notFoundResponse.headers.set('X-Error-Type', 'not-found');
      
      return notFoundResponse;
    }
    
    const responseTime = Date.now() - startTime;
    const response = NextResponse.json(updatedActivation[0]);
    
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Operation', 'activation-end');
    response.headers.set('X-Activation-ID', activationId.toString());
    
    return response;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${requestId}] End activation error (${responseTime}ms):`, error);
    }
    
    const errorResponse = NextResponse.json(
      { error: 'Internal server error', requestId },
      { status: 500 }
    );
    
    errorResponse.headers.set('X-Request-ID', requestId);
    errorResponse.headers.set('X-Response-Time', `${responseTime}ms`);
    errorResponse.headers.set('X-Operation', 'activation-end');
    errorResponse.headers.set('X-Error-Type', 'database');
    
    return errorResponse;
  }
} 