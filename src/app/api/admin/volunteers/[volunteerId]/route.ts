import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { volunteers, activations, adiSubmissions } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { volunteerId: string } }
) {
  try {
    const volunteerId = Number(params.volunteerId);
    
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
      .where(eq(volunteers.volunteerId, volunteerId))
      .limit(1);

    if (existingVolunteer.length === 0) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    console.log(
      `Attempting to delete volunteer ${volunteerId}: ${existingVolunteer[0]?.callsign ?? 'unknown'}`
    );

    // Check for any activations (active or ended) for this volunteer
    const volunteerActivations = await db()
      .select()
      .from(activations)
      .where(eq(activations.volunteerId, volunteerId));

    console.log(`Found ${volunteerActivations.length} activations for volunteer ${volunteerId}`);

    // Check for any ADI submissions for this volunteer
    const volunteerAdiSubmissions = await db()
      .select()
      .from(adiSubmissions)
      .where(eq(adiSubmissions.volunteerId, volunteerId));

    console.log(`Found ${volunteerAdiSubmissions.length} ADI submissions for volunteer ${volunteerId}`);

    // Delete activations first (cascade)
    if (volunteerActivations.length > 0) {
      const deletedActivations = await db()
        .delete(activations)
        .where(eq(activations.volunteerId, volunteerId))
        .returning();
      console.log(`Deleted ${deletedActivations.length} activations for volunteer ${volunteerId}`);
    }

    // Delete ADI submissions (cascade)
    if (volunteerAdiSubmissions.length > 0) {
      const deletedSubmissions = await db()
        .delete(adiSubmissions)
        .where(eq(adiSubmissions.volunteerId, volunteerId))
        .returning();
      console.log(`Deleted ${deletedSubmissions.length} ADI submissions for volunteer ${volunteerId}`);
    }

    // Now safe to delete volunteer
    const deletedVolunteer = await db()
      .delete(volunteers)
      .where(eq(volunteers.volunteerId, volunteerId))
      .returning();

    const message = `Volunteer ${deletedVolunteer[0]?.callsign ?? 'unknown'} deleted successfully` +
      (volunteerActivations.length > 0 ? ` (${volunteerActivations.length} activations also deleted)` : '') +
      (volunteerAdiSubmissions.length > 0 ? ` (${volunteerAdiSubmissions.length} ADI submissions also deleted)` : '');

    return NextResponse.json({ 
      message,
      deletedVolunteer: deletedVolunteer[0],
      cascadeDeleted: {
        activations: volunteerActivations.length,
        adiSubmissions: volunteerAdiSubmissions.length
      }
    });
    
  } catch (error) {
    console.error('Delete volunteer error:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Handle specific database constraint errors
    if (error instanceof Error) {
      if (error.message.includes('foreign key constraint') || error.message.includes('violates foreign key')) {
        return NextResponse.json(
          { error: 'Cannot delete volunteer: they have associated records' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { volunteerId: string } }
) {
  try {
    const volunteerId = Number(params.volunteerId);
    
    if (isNaN(volunteerId)) {
      return NextResponse.json(
        { error: 'Invalid volunteer ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, callsign, state, pin, role } = body;

    // Check if volunteer exists
    const existingVolunteer = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.volunteerId, volunteerId))
      .limit(1);

    if (existingVolunteer.length === 0) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Update volunteer
    const updatedVolunteer = await db()
      .update(volunteers)
      .set({
        name,
        callsign,
        state,
        pin,
        role: role || 'volunteer'
      })
      .where(eq(volunteers.volunteerId, volunteerId))
      .returning();

    return NextResponse.json(updatedVolunteer[0]);
    
  } catch (error) {
    console.error('Update volunteer error:', error);
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { volunteerId: string } }
) {
  try {
    const volunteerId = Number(params.volunteerId);
    
    if (isNaN(volunteerId)) {
      return NextResponse.json(
        { error: 'Invalid volunteer ID' },
        { status: 400 }
      );
    }

    const volunteer = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.volunteerId, volunteerId))
      .limit(1);

    if (volunteer.length === 0) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer[0]);
    
  } catch (error) {
    console.error('Get volunteer error:', error);
    return NextResponse.json(
      { error: 'Failed to get volunteer' },
      { status: 500 }
    );
  }
} 