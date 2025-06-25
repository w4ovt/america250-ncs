import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { pins } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

const RESERVED_PINS = ['7317', '7373'];

export async function DELETE(request: NextRequest) {
  try {
    // Extract pinId from the URL
    const urlParts = request.nextUrl.pathname.split('/');
    const pinIdStr = urlParts[urlParts.length - 1];
    const pinId = parseInt(pinIdStr);

    if (isNaN(pinId)) {
      return NextResponse.json(
        { error: 'Invalid PIN ID' },
        { status: 400 }
      );
    }

    // Get the PIN to check if it's reserved
    const pinRecord = await db
      .select({ pin: pins.pin })
      .from(pins)
      .where(eq(pins.pinId, pinId));

    if (pinRecord.length === 0) {
      return NextResponse.json(
        { error: 'PIN not found' },
        { status: 404 }
      );
    }

    // Check if PIN is reserved
    if (RESERVED_PINS.includes(String(pinRecord[0].pin))) {
      return NextResponse.json(
        { error: `Cannot delete reserved PIN ${pinRecord[0].pin}` },
        { status: 403 }
      );
    }

    // Delete the PIN (this will NOT cascade to volunteers)
    await db
      .delete(pins)
      .where(eq(pins.pinId, pinId));

    return NextResponse.json({
      message: `PIN ${pinRecord[0].pin} deleted successfully`
    });

  } catch (error) {
    console.error('PIN deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 