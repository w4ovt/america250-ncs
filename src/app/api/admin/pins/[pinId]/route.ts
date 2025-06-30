import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { volunteers } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
  try {
    // Extract volunteerId from the URL path
    const { pathname } = req.nextUrl;
    const segments = pathname.split('/');
    const volunteerIdStr = segments[segments.length - 1];
    const volunteerId = Number(volunteerIdStr);

    if (isNaN(volunteerId)) {
      return NextResponse.json(
        { error: 'Invalid volunteer ID' },
        { status: 400 }
      );
    }

    // Check if volunteer exists
    const existingVolunteer = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.volunteerId, volunteerId));

    if (existingVolunteer.length === 0) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Safe to delete volunteer
    const deletedVolunteer = await db()
      .delete(volunteers)
      .where(eq(volunteers.volunteerId, volunteerId))
      .returning();

    return NextResponse.json({ 
      message: 'Volunteer deleted successfully',
      deletedVolunteer: deletedVolunteer[0]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 