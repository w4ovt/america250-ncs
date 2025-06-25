import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';

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

    // Validate frequency range (1.8 - 148 MHz)
    if (frequencyMhz < 1.8 || frequencyMhz > 148) {
      return NextResponse.json(
        { error: 'Frequency must be between 1.8 and 148 MHz' },
        { status: 400 }
      );
    }

    // Validate mode
    const validModes = ['SSB', 'CW', 'FT8', 'FT4', 'FM', 'AM', 'EchoLink', 'Other'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode' },
        { status: 400 }
      );
    }

    // Insert new activation
    const [newActivation] = await db.insert(activations).values({
      volunteerId,
      frequencyMhz,
      mode,
      startedAt: new Date(),
      endedAt: null
    }).returning();

    return NextResponse.json({
      activationId: newActivation.activationId,
      message: 'Activation started successfully'
    });

  } catch (error) {
    console.error('Activation creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 