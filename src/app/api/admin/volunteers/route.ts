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

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication via cookie
    const cookie = request.cookies.get('volunteerAuth');
    let isAdmin = false;
    if (cookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(cookie.value));
        if (authData.role === 'admin') {
          isAdmin = true;
        }
      } catch {
        // Invalid cookie, treat as not admin
      }
    }

    // Fetch all volunteers
    const volunteerList = await db().select({
      volunteerId: volunteers.volunteerId,
      name: volunteers.name,
      callsign: volunteers.callsign,
      state: volunteers.state,
      pin: volunteers.pin,
      role: volunteers.role
    }).from(volunteers).orderBy(volunteers.callsign);

    // Only include PINs for admins
    const sanitizedVolunteers = volunteerList.map(volunteer => {
      if (isAdmin) {
        return volunteer;
      } else {
        const { pin, ...rest } = volunteer;
        return rest;
      }
    });

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