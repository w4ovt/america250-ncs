import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allPins = await db().select().from(pins);
    return NextResponse.json(allPins);
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch pins:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch pins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { pin, role } = body;
    role = role || 'volunteer';

    // Helper to generate a random 4-digit PIN as a string
    async function generateUniquePin() {
      let newPin;
      let exists = true;
      while (exists) {
        newPin = Math.floor(1000 + Math.random() * 9000).toString();
        const existing = await db().select().from(pins).where(eq(pins.pin, newPin));
        exists = existing.length > 0;
      }
      return newPin;
    }

    // If a PIN is provided, validate it
    if (pin) {
      if (!/^[0-9]{4}$/.test(pin)) {
        return NextResponse.json({ 
          error: 'PIN must be exactly 4 digits',
          details: 'Current format required: 0000-9999'
        }, { status: 400 });
      }
      const existing = await db().select().from(pins).where(eq(pins.pin, pin));
      if (existing.length > 0) {
        return NextResponse.json({ error: 'PIN already exists' }, { status: 400 });
      }
    } else {
      // Generate a unique PIN
      pin = await generateUniquePin();
    }

    const newPin = await db().insert(pins).values({ pin, role }).returning();
    return NextResponse.json(newPin[0]);
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to create pin:', error);
    }
    return NextResponse.json(
      { error: 'Failed to create pin' },
      { status: 500 }
    );
  }
} 