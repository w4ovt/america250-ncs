import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations, volunteers } from '../../../../db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET() {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();
  
  try {
    // Get all active activations with volunteer information
    const activeActivations = await db()
      .select({
        activationId: activations.activationId,
        frequencyMhz: activations.frequencyMhz,
        mode: activations.mode,
        startedAt: activations.startedAt,
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state,
      })
      .from(activations)
      .leftJoin(volunteers, eq(activations.volunteerId, volunteers.volunteerId))
      .where(isNull(activations.endedAt))
      .orderBy(activations.startedAt);

    const responseTime = Date.now() - startTime;
    const response = NextResponse.json(activeActivations);
    
    // Add debugging headers
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Record-Count', activeActivations.length.toString());
    response.headers.set('X-API-Version', '1.0.0');
    
    return response;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] Activation list error (${responseTime}ms):`, error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch activations', requestId },
      { status: 500 }
    );
    
    errorResponse.headers.set('X-Request-ID', requestId);
    errorResponse.headers.set('X-Response-Time', `${responseTime}ms`);
    errorResponse.headers.set('X-Error-Type', 'database');
    
    return errorResponse;
  }
} 