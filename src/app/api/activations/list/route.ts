import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations, volunteers } from '../../../../db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all active activations with volunteer information
    const activeActivations = await db
      .select({
        activationId: activations.activationId,
        frequencyMhz: activations.frequencyMhz,
        mode: activations.mode,
        startedAt: activations.startedAt,
        volunteerId: volunteers.volunteerId,
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state
      })
      .from(activations)
      .innerJoin(volunteers, eq(activations.volunteerId, volunteers.volunteerId))
      .where(isNull(activations.endedAt))
      .orderBy(activations.startedAt);

    return NextResponse.json(activeActivations);

  } catch (error) {
    console.error('Activation list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 