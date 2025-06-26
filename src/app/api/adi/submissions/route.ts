import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { logSubmissions } from '../../../../db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const submissions = await db()
      .select({
        id: logSubmissions.id,
        filename: logSubmissions.filename,
        submitterName: logSubmissions.name,
        submitterCall: logSubmissions.callsign,
        result: logSubmissions.result,
        recordCount: logSubmissions.recordCount,
        submittedAt: logSubmissions.createdAt,
      })
      .from(logSubmissions)
      .orderBy(desc(logSubmissions.createdAt));

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to fetch ADI submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
} 