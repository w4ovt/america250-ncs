import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteers } from '../../../../db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pinId, name, callsign, state } = body;
    
    const newVolunteer = await db().insert(volunteers).values({
      pinId,
      name,
      callsign,
      state
    }).returning();
    
    return NextResponse.json(newVolunteer[0]);
  } catch (error) {
    console.error('Failed to create volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to create volunteer' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const volunteerList = await db().select({
      volunteerId: volunteers.volunteerId,
      name: volunteers.name,
      callsign: volunteers.callsign,
      state: volunteers.state
    }).from(volunteers).orderBy(volunteers.callsign);

    return NextResponse.json(volunteerList);

  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 