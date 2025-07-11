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
    const validModes = ['SSB', 'CW', 'FT8', 'FT4', 'PSK31', 'Olivia', 'FM', 'AM', 'EchoLink', 'Other'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${validModes.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert new activation
    const newActivation = await db().insert(activations).values({
      volunteerId,
      frequencyMhz,
      mode,
      startedAt: new Date()
    }).returning();

    return NextResponse.json(newActivation[0]);

  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Create activation error:', error);
    }
    
    return NextResponse.json(
      { error: 'Failed to create activation' },
      { status: 500 }
    );
  }
} 