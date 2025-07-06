import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations, volunteers } from '../../../../db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET() {
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

    return NextResponse.json(activeActivations, {
      headers: {
        // Cache for 30 seconds to reduce database load
        'Cache-Control': 'public, max-age=30, s-maxage=30',
        'Pragma': 'no-cache',
        'Expires': new Date(Date.now() + 30000).toUTCString(),
        // Add performance headers
        'X-Response-Time': `${Date.now() - Date.now()}ms`,
        'X-Cache-Status': 'MISS',
      },
    });
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Activation list error:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch activations' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
} 