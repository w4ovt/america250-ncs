import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations, volunteers } from '../../../../db/schema';
import { isNotNull, eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all ended activations with volunteer information
    const archivedActivations = await db
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

    return NextResponse.json(archivedActivations);

  } catch (error) {
    console.error('Archived activations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 