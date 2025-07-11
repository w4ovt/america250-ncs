import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { adiSubmissions } from '../../../../db/schema';
import { eq, desc, asc, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // const sortBy = searchParams.get('sortBy') || 'submittedAt'; // No longer used
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';
    const includeContent = searchParams.get('includeContent') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query with conditional fileContent inclusion
    let submissions;
    if (includeContent) {
      submissions = await db()
        .select({
          id: adiSubmissions.id,
          submittedAt: adiSubmissions.submittedAt,
          filename: adiSubmissions.filename,
          volunteerId: adiSubmissions.volunteerId,
          recordCount: adiSubmissions.recordCount,
          processedCount: adiSubmissions.processedCount,
          status: adiSubmissions.status,
          fileContent: adiSubmissions.fileContent,
        })
        .from(adiSubmissions)
        .where(search.trim() ? like(adiSubmissions.filename, `%${search}%`) : undefined)
        .orderBy(
          sortOrder === 'desc'
            ? desc(adiSubmissions.submittedAt)
            : asc(adiSubmissions.submittedAt)
        )
        .limit(limit)
        .offset(offset);
    } else {
      submissions = await db()
        .select({
          id: adiSubmissions.id,
          submittedAt: adiSubmissions.submittedAt,
          filename: adiSubmissions.filename,
          volunteerId: adiSubmissions.volunteerId,
          recordCount: adiSubmissions.recordCount,
          processedCount: adiSubmissions.processedCount,
          status: adiSubmissions.status,
        })
        .from(adiSubmissions)
        .where(search.trim() ? like(adiSubmissions.filename, `%${search}%`) : undefined)
        .orderBy(
          sortOrder === 'desc'
            ? desc(adiSubmissions.submittedAt)
            : asc(adiSubmissions.submittedAt)
        )
        .limit(limit)
        .offset(offset);
    }

    // Get total count for pagination (only if needed)
    let totalCount = 0;
    if (page === 1) { // Only count on first page to reduce queries
      const countResult = await db()
        .select({ count: adiSubmissions.id })
        .from(adiSubmissions)
        .where(search.trim() ? like(adiSubmissions.filename, `%${search}%`) : undefined);
      totalCount = countResult.length;
    }

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching ADI submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch ADI submissions' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Validate ID is a valid number
    const submissionId = parseInt(id);
    if (isNaN(submissionId) || submissionId <= 0) {
      return NextResponse.json(
        { error: 'Submission ID must be a valid positive number' },
        { status: 400 }
      );
    }
    
    await db()
      .delete(adiSubmissions)
      .where(eq(adiSubmissions.id, submissionId));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting ADI submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete ADI submission' },
      { status: 500 }
    );
  }
} 