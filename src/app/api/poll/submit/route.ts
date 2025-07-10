import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteers, volunteer_feedback_responses } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      pin, 
      pinEase, 
      guideAccess, 
      guideUsefulness, 
      activationEase, 
      dropboxUsefulness, 
      techSupport, 
      returnAvailability, 
      featuresSuggested, 
      siteImprovementSuggestions, 
      additionalComments 
    } = body;

    // Validate PIN format
    if (!pin || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format' },
        { status: 400 }
      );
    }

    // Validate PIN against volunteers table
    const volunteerRecord = await db()
      .select()
      .from(volunteers)
      .where(eq(volunteers.pin, pin))
      .limit(1);

    if (volunteerRecord.length === 0) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    const volunteer = volunteerRecord[0];
    if (!volunteer) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Validate Likert scale values (1-7)
    const likertFields = [pinEase, guideAccess, guideUsefulness, activationEase, dropboxUsefulness, techSupport];
    for (const field of likertFields) {
      if (!field || field < 1 || field > 7) {
        return NextResponse.json(
          { error: 'All rating fields must be between 1 and 7' },
          { status: 400 }
        );
      }
    }

    // Validate return availability
    if (!returnAvailability || !['YES', 'MAYBE', 'NO'].includes(returnAvailability)) {
      return NextResponse.json(
        { error: 'Return availability must be YES, MAYBE, or NO' },
        { status: 400 }
      );
    }

    // Check if volunteer has already submitted feedback
    const existingResponse = await db()
      .select()
      .from(volunteer_feedback_responses)
      .where(eq(volunteer_feedback_responses.volunteerId, volunteer.volunteerId))
      .limit(1);

    if (existingResponse.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted feedback. Thank you!' },
        { status: 409 }
      );
    }

    // Insert the response
    const newResponse = await db()
      .insert(volunteer_feedback_responses)
      .values({
        volunteerId: volunteer.volunteerId,
        pinEase,
        guideAccess,
        guideUsefulness,
        activationEase,
        dropboxUsefulness,
        techSupport,
        returnAvailability,
        featuresSuggested: featuresSuggested || null,
        siteImprovementSuggestions: siteImprovementSuggestions || null,
        additionalComments: additionalComments || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      responseId: newResponse[0]?.responseId,
      volunteerName: volunteer.name,
      returnAvailability
    });

  } catch (error) {
    console.error('Poll submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
} 