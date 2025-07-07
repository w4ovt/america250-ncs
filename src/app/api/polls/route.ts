import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { polls } from '../../../db/schema';
import { and, eq, gte, isNull, or } from 'drizzle-orm';

// GET /api/polls - List active polls by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollType = searchParams.get('type'); // 'visitor' or 'volunteer'
    
    if (!pollType || !['visitor', 'volunteer'].includes(pollType)) {
      return NextResponse.json({ error: 'Invalid poll type' }, { status: 400 });
    }
    const pollTypeEnum = pollType as 'visitor' | 'volunteer';

    // Get active polls of the specified type
    const activePolls = await db()
      .select({
        id: polls.id,
        title: polls.title,
        description: polls.description,
        question: polls.question,
        options: polls.options,
        allowMultiple: polls.allowMultiple,
        displayOrder: polls.displayOrder,
      })
      .from(polls)
      .where(
        and(
          eq(polls.pollType, pollTypeEnum),
          eq(polls.isActive, true),
          or(
            isNull(polls.expiresAt),
            gte(polls.expiresAt, new Date())
          )
        )
      )
      .orderBy(polls.displayOrder, polls.createdAt);

    return NextResponse.json(activePolls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/polls - Create a new poll (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, pollType, question, options, allowMultiple, expiresAt, displayOrder } = body;

    // Validate required fields
    if (!title || !pollType || !question || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['visitor', 'volunteer'].includes(pollType)) {
      return NextResponse.json({ error: 'Invalid poll type' }, { status: 400 });
    }

    // Create the poll
    const newPoll = await db()
      .insert(polls)
      .values({
        title,
        description,
        pollType,
        question,
        options,
        allowMultiple: allowMultiple || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        displayOrder: displayOrder || 0,
        createdBy: null, // TODO: Get from authenticated admin session
      })
      .returning();

    return NextResponse.json(newPoll[0], { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 