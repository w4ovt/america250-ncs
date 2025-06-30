import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { activationId } = await request.json();
    
    if (!activationId) {
      return NextResponse.json(
        { error: 'Activation ID is required' },
        { status: 400 }
      );
    }
    
    const updatedActivation = await db()
      .update(activations)
      .set({ endedAt: new Date() })
      .where(eq(activations.activationId, activationId))
      .returning();
    
    if (updatedActivation.length === 0) {
      return NextResponse.json(
        { error: 'Activation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedActivation[0]);
    
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('End activation error:', error);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 