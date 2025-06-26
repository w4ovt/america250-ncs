import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { pins } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
  try {
    // Extract pinId from the URL path
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const pinIdStr = segments[segments.length - 1];
    const pinId = Number(pinIdStr);

    if (isNaN(pinId)) {
      return NextResponse.json(
        { error: 'Invalid PIN ID' },
        { status: 400 }
      );
    }

    const deletedPin = await db()
      .delete(pins)
      .where(eq(pins.pinId, pinId))
      .returning();

    if (deletedPin.length === 0) {
      return NextResponse.json(
        { error: 'PIN not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'PIN deleted successfully' });
  } catch (error) {
    console.error('Delete PIN error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 