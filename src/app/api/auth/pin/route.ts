import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins, volunteers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    
    if (!pin) {
      return NextResponse.json(
        { error: 'PIN is required' },
        { status: 400 }
      );
    }
    
    // Find the PIN
    const pinRecord = await db()
      .select()
      .from(pins)
      .where(eq(pins.pin, pin));
    
    if (pinRecord.length === 0) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }
    
    // Get volunteer information if it exists
    const volunteerRecord = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.pinId, pinRecord[0].pinId));
    
    return NextResponse.json({
      pinId: pinRecord[0].pinId,
      role: pinRecord[0].role,
      volunteer: volunteerRecord.length > 0 ? volunteerRecord[0] : null
    });
    
  } catch (error) {
    console.error('PIN authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 