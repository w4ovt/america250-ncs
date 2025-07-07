import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { pollResponses, polls } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// POST /api/polls/responses - Submit a poll response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, selectedOptions, textResponse, volunteerId } = body;

    // Validate required fields
    if (!pollId || (!selectedOptions && !textResponse)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate selectedOptions format
    if (selectedOptions && (!Array.isArray(selectedOptions) || selectedOptions.some(opt => typeof opt !== 'number'))) {
      return NextResponse.json({ error: 'Invalid selectedOptions format' }, { status: 400 });
    }

    // Get poll details to validate
    const poll = await db()
      .select({
        id: polls.id,
        pollType: polls.pollType,
        allowMultiple: polls.allowMultiple,
        options: polls.options,
        isActive: polls.isActive,
      })
      .from(polls)
      .where(eq(polls.id, pollId))
      .limit(1);

    if (!poll.length) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const pollData = poll[0];
    if (!pollData || !pollData.isActive) {
      return NextResponse.json({ error: 'Poll is not active' }, { status: 400 });
    }

    // Validate selectedOptions against poll options
    if (selectedOptions) {
      const pollOptions = pollData.options as string[];
      const maxOptionIndex = pollOptions.length - 1;
      if (selectedOptions.some((opt: number) => opt < 0 || opt > maxOptionIndex)) {
        return NextResponse.json({ error: 'Invalid option selection' }, { status: 400 });
      }

      // Check if multiple selection is allowed
      if (!pollData.allowMultiple && selectedOptions.length > 1) {
        return NextResponse.json({ error: 'Multiple selection not allowed' }, { status: 400 });
      }
    }

    // Prepare response data
    const responseData: { selectedOptions?: number[]; textResponse?: string } = {};
    if (selectedOptions) {
      responseData.selectedOptions = selectedOptions;
    }
    if (textResponse) {
      responseData.textResponse = textResponse;
    }

    // Get client info for visitor responses
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create the response
    const newResponse = await db()
      .insert(pollResponses)
      .values({
        pollId,
        volunteerId: volunteerId || null, // null for visitor responses
        responseData,
        ipAddress: volunteerId ? null : ipAddress, // Only store IP for visitor responses
        userAgent: volunteerId ? null : userAgent, // Only store user agent for visitor responses
      })
      .returning();

    return NextResponse.json(newResponse[0], { status: 201 });
  } catch (error) {
    console.error('Error submitting poll response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/polls/responses - Get poll results (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json({ error: 'Poll ID required' }, { status: 400 });
    }

    // Get poll details
    const poll = await db()
      .select({
        id: polls.id,
        title: polls.title,
        question: polls.question,
        options: polls.options,
        pollType: polls.pollType,
      })
      .from(polls)
      .where(eq(polls.id, parseInt(pollId)))
      .limit(1);

    if (!poll.length) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const pollData = poll[0];
    if (!pollData) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Get all responses for this poll
    const responses = await db()
      .select({
        id: pollResponses.id,
        responseData: pollResponses.responseData,
        createdAt: pollResponses.createdAt,
        volunteerId: pollResponses.volunteerId,
      })
      .from(pollResponses)
      .where(eq(pollResponses.pollId, parseInt(pollId)))
      .orderBy(pollResponses.createdAt);

    // Process results
    const options = pollData.options as string[];
    const optionCounts = new Array(options.length).fill(0);
    const textResponses: string[] = [];
    let totalResponses = 0;

    responses.forEach(response => {
      const data = response.responseData as { selectedOptions?: number[]; textResponse?: string };
      totalResponses++;

      if (data.selectedOptions) {
        data.selectedOptions.forEach((optionIndex: number) => {
          if (optionIndex >= 0 && optionIndex < optionCounts.length) {
            optionCounts[optionIndex]++;
          }
        });
      }

      if (data.textResponse) {
        textResponses.push(data.textResponse);
      }
    });

    return NextResponse.json({
      poll: pollData,
      results: {
        totalResponses,
        optionCounts,
        textResponses,
        responses: responses.slice(0, 100), // Limit to last 100 responses
      }
    });
  } catch (error) {
    console.error('Error fetching poll results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 