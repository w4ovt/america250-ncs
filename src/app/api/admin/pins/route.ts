import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pins } from '../../../../db/schema';

export async function GET() {
  try {
    const allPins = await db().select().from(pins);
    return NextResponse.json(allPins);
  } catch (error) {
    console.error('Failed to fetch pins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin, role } = body;
    
    const newPin = await db().insert(pins).values({
      pin,
      role: role || 'volunteer'
    }).returning();
    
    return NextResponse.json(newPin[0]);
  } catch (error) {
    console.error('Failed to create pin:', error);
    return NextResponse.json(
      { error: 'Failed to create pin' },
      { status: 500 }
    );
  }
} 