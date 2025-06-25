import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins } from '../../../../db/schema';

const RESERVED_PINS = ['7317', '7373'];

export async function GET() {
  try {
    const allPins = await db
      .select({
        pinId: pins.pinId,
        pin: pins.pin,
        role: pins.role
      })
      .from(pins)
      .orderBy(pins.pinId);

    return NextResponse.json(allPins);

  } catch (error) {
    console.error('PIN list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();

    // Validate role
    if (!role || !['volunteer', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "volunteer" or "admin"' },
        { status: 400 }
      );
    }

    // Get all existing PINs to find the next available one
    const existingPins = await db
      .select({ pin: pins.pin })
      .from(pins);

    const existingPinNumbers = existingPins.map(p => p.pin);
    
    // Find next available PIN starting from 1000, skipping reserved PINs
    let nextPin = 1000;
    while (
      existingPinNumbers.includes(nextPin.toString()) || 
      RESERVED_PINS.includes(nextPin.toString())
    ) {
      nextPin++;
    }

    // Insert new PIN
    const [newPin] = await db.insert(pins).values({
      pin: nextPin.toString(),
      role: role
    }).returning();

    return NextResponse.json({
      pinId: newPin.pinId,
      pin: newPin.pin,
      role: newPin.role,
      message: 'PIN created successfully'
    });

  } catch (error) {
    console.error('PIN creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 