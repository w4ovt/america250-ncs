import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { activationId } = await request.json();

    // Validate required fields
    if (!activationId || typeof activationId !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid activationId' },
        { status: 400 }
      );
    }

    // Check if activation exists and is currently active
    const existingActivation = await db
      .select()
      .from(activations)
      .where(and(
        eq(activations.activationId, activationId),
        isNull(activations.endedAt)
      ));

    if (existingActivation.length === 0) {
      return NextResponse.json(
        { error: 'Activation not found or already ended' },
        { status: 404 }
      );
    }

    // End the activation by setting endedAt = now()
    await db
      .update(activations)
      .set({ endedAt: new Date() })
      .where(eq(activations.activationId, activationId));

    return NextResponse.json({
      message: 'Activation ended successfully',
      activationId
    });

  } catch (error) {
    console.error('Activation end error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 