import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { volunteer_feedback_responses } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  context: { params: { responseId: string } }
) {
  // Ensure we have a resolved params object regardless of sync or async variants
  const { responseId: idString } = await Promise.resolve(context.params);
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

    const responseId = Number(idString);
    
    if (isNaN(responseId)) {
      return NextResponse.json(
        { error: 'Invalid response ID' },
        { status: 400 }
      );
    }

    // Check if response exists
    const existingResponse = await db()
      .select()
      .from(volunteer_feedback_responses)
      .where(eq(volunteer_feedback_responses.responseId, responseId))
      .limit(1);

    if (existingResponse.length === 0) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      );
    }

    // Delete the response
    await db()
      .delete(volunteer_feedback_responses)
      .where(eq(volunteer_feedback_responses.responseId, responseId));

    return NextResponse.json({
      success: true,
      message: 'Response deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting poll response:', error);
    return NextResponse.json(
      { error: 'Failed to delete response' },
      { status: 500 }
    );
  }
} 