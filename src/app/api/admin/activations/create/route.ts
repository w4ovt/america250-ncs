import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { activations, volunteers } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { volunteerId, frequencyMhz, mode } = await request.json();

    // Validate required fields
    if (!volunteerId || !frequencyMhz || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: volunteerId, frequencyMhz, mode' },
        { status: 400 }
      );
    }

    // Check if volunteer exists
    const volunteer = await db().select().from(volunteers).where(eq(volunteers.volunteerId, volunteerId)).limit(1);
    
    if (volunteer.length === 0) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Check if volunteer already has an active activation
    const existingActivation = await db().select()
      .from(activations)
      .where(eq(activations.volunteerId, volunteerId))
      .where(eq(activations.endedAt, null))
      .limit(1);

    if (existingActivation.length > 0) {
      return NextResponse.json(
        { error: 'Volunteer already has an active activation' },
        { status: 400 }
      );
    }

    // Create the activation
    const [newActivation] = await db().insert(activations).values({
      volunteerId,
      frequencyMhz: frequencyMhz.toString(),
      mode,
      startedAt: new Date()
    }).returning();

    return NextResponse.json({
      message: 'Activation created successfully',
      activation: newActivation
    });

  } catch (error) {
    console.error('Error creating activation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 