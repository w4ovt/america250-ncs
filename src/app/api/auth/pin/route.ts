import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins, volunteers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    // Validate PIN format
    if (!pin || typeof pin !== 'string' || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format. Must be 4 digits.' },
        { status: 400 }
      );
    }

    // Find PIN in database
    const pinRecord = (await db.select().from(pins).where(eq(pins.pin, pin)))[0];

    if (!pinRecord) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Find associated volunteer (if any)
    const volunteer = (await db.select().from(volunteers).where(eq(volunteers.pinId, pinRecord.pinId)))[0];

    // Return success response
    return NextResponse.json({
      pinId: pinRecord.pinId,
      role: pinRecord.role,
      volunteer: volunteer ? {
        volunteerId: volunteer.volunteerId,
        name: volunteer.name,
        callsign: volunteer.callsign,
        state: volunteer.state
      } : null
    });

  } catch (error) {
    console.error('PIN authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 