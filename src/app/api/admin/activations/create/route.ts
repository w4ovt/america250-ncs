import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { activations, volunteers } from '../../../../../db/schema';
import { and, eq, isNull } from 'drizzle-orm';

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

    // Validate volunteerId is a number
    if (typeof volunteerId !== 'number' || volunteerId <= 0) {
      return NextResponse.json(
        { error: 'volunteerId must be a positive number' },
        { status: 400 }
      );
    }

    // Validate frequency range (1.8 - 148 MHz)
    if (typeof frequencyMhz !== 'number' || frequencyMhz < 1.8 || frequencyMhz > 148) {
      return NextResponse.json(
        { error: 'Frequency must be a number between 1.8 and 148 MHz' },
        { status: 400 }
      );
    }

    // Validate mode
    const validModes = ['SSB', 'CW', 'FT8', 'FT4', 'PSK31', 'Olivia', 'FM', 'AM', 'EchoLink', 'Other'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${validModes.join(', ')}` },
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
      .where(and(
        eq(activations.volunteerId, volunteerId),
        isNull(activations.endedAt)
      ))
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
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating activation:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to create activation' },
      { status: 500 }
    );
  }
} 