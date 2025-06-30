import { NextResponse } from 'next/server';
import { desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '../../../../db';
import { activations, volunteers } from '../../../../db/schema';

export async function GET() {
  try {
    // Get all ended activations with volunteer information
    const archivedActivations = await db()
      .select({
        activationId: activations.activationId,
        frequencyMhz: activations.frequencyMhz,
        mode: activations.mode,
        startedAt: activations.startedAt,
        endedAt: activations.endedAt,
        volunteerId: volunteers.volunteerId,
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state
      })
      .from(activations)
      .innerJoin(volunteers, eq(activations.volunteerId, volunteers.volunteerId))
      .where(isNotNull(activations.endedAt))
      .orderBy(desc(activations.endedAt));

    return NextResponse.json(archivedActivations, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Activation archive error:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve archived activations' },
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