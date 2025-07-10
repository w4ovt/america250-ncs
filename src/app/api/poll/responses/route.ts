import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteers, volunteer_feedback_responses } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication
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

    // Fallback: Check for auth data in headers
    if (!isAdmin) {
      const authHeader = request.headers.get('x-volunteer-auth');
      if (authHeader) {
        try {
          const authData = JSON.parse(decodeURIComponent(authHeader));
          if (authData.role === 'admin') {
            isAdmin = true;
          }
        } catch {
          // Invalid header, treat as not admin
        }
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all poll responses with volunteer metadata
    const responses = await db()
      .select({
        responseId: volunteer_feedback_responses.responseId,
        volunteerId: volunteer_feedback_responses.volunteerId,
        name: volunteers.name,
        callsign: volunteers.callsign,
        pinEase: volunteer_feedback_responses.pinEase,
        guideAccess: volunteer_feedback_responses.guideAccess,
        guideUsefulness: volunteer_feedback_responses.guideUsefulness,
        activationEase: volunteer_feedback_responses.activationEase,
        dropboxUsefulness: volunteer_feedback_responses.dropboxUsefulness,
        techSupport: volunteer_feedback_responses.techSupport,
        returnAvailability: volunteer_feedback_responses.returnAvailability,
        featuresSuggested: volunteer_feedback_responses.featuresSuggested,
        siteImprovementSuggestions: volunteer_feedback_responses.siteImprovementSuggestions,
        additionalComments: volunteer_feedback_responses.additionalComments,
        submittedAt: volunteer_feedback_responses.submittedAt,
      })
      .from(volunteer_feedback_responses)
      .innerJoin(volunteers, eq(volunteer_feedback_responses.volunteerId, volunteers.volunteerId))
      .orderBy(volunteer_feedback_responses.submittedAt);

    return NextResponse.json(responses);

  } catch (error) {
    console.error('Error fetching poll responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll responses' },
      { status: 500 }
    );
  }
} 