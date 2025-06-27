import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { adiSubmissions, volunteers } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build the query with joins to get volunteer information
    const query = db()
      .select({
        id: adiSubmissions.id,
        submittedAt: adiSubmissions.submittedAt,
        filename: adiSubmissions.filename,
        fileContent: adiSubmissions.fileContent,
        recordCount: adiSubmissions.recordCount,
        processedCount: adiSubmissions.processedCount,
        status: adiSubmissions.status,
        volunteerName: volunteers.name,
        volunteerCallsign: volunteers.callsign,
        volunteerState: volunteers.state
      })
      .from(adiSubmissions)
      .leftJoin(volunteers, eq(adiSubmissions.volunteerId, volunteers.volunteerId));
    
    // TODO: Implement search functionality in future update
    // For now, we'll fetch all submissions and filter client-side if needed
    
    const submissions = await query;
    
    // Sort the results (client-side sorting for now)
    submissions.sort((a, b) => {
      let aValue: string | number | Date | null = a[sortBy as keyof typeof a];
      let bValue: string | number | Date | null = b[sortBy as keyof typeof b];
      
      if (sortOrder === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }
      
      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime();
      }
      
      return (aValue as number || 0) - (bValue as number || 0);
    });
    
    return NextResponse.json(submissions);
    
  } catch (error) {
    console.error('Error fetching ADI submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ADI submissions' },
      { status: 500 }
    );
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
    
    await db()
      .delete(adiSubmissions)
      .where(eq(adiSubmissions.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting ADI submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete ADI submission' },
      { status: 500 }
    );
  }
} 