import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteers } from '../../../../db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, callsign, state, pin, role } = body;
    
    // Basic input validation
    if (!name || !callsign || !state || !pin) {
      return NextResponse.json(
        { error: 'Missing required fields: name, callsign, state, pin' },
        { status: 400 }
      );
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 4 digits' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !['admin', 'volunteer'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either admin or volunteer' },
        { status: 400 }
      );
    }
    
    const newVolunteer = await db().insert(volunteers).values({
      name,
      callsign,
      state,
      pin,
      role: role || 'volunteer'
    }).returning();
    
    return NextResponse.json(newVolunteer[0]);
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to create volunteer:', error);
    }
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
      state: volunteers.state,
      pin: volunteers.pin,
      role: volunteers.role
    }).from(volunteers).orderBy(volunteers.callsign);

    // Sanitize response - remove PINs for security
    const sanitizedVolunteers = volunteerList.map(volunteer => ({
      volunteerId: volunteer.volunteerId,
      name: volunteer.name,
      callsign: volunteer.callsign,
      state: volunteer.state,
      role: volunteer.role
      // PIN removed for security
    }));

    return NextResponse.json(sanitizedVolunteers);

  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching volunteers:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 