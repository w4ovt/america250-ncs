import { NextResponse } from 'next/server';

// Placeholder data for ADI submissions until actual implementation
const placeholderADISubmissions = [
  {
    id: 1,
    filename: 'sample_log_2024.adi',
    submitterName: 'John Smith',
    submitterCall: 'W1ABC',
    result: 'Success' as const,
    recordCount: 15,
    submittedAt: '2024-01-15T10:30:00Z',
    fileContent: 'Sample ADI content'
  },
  {
    id: 2,
    filename: 'contest_log.adi',
    submitterName: 'Jane Doe',
    submitterCall: 'K2XYZ',
    result: 'Success' as const,
    recordCount: 23,
    submittedAt: '2024-01-15T11:45:00Z',
    fileContent: 'Contest log content'
  },
  {
    id: 3,
    filename: 'invalid_format.txt',
    submitterName: 'Bob Wilson',
    submitterCall: 'N3DEF',
    result: 'Failure' as const,
    recordCount: 0,
    submittedAt: '2024-01-15T12:15:00Z',
    fileContent: 'Invalid file content'
  }
];

export async function GET() {
  try {
    // Return placeholder data for now
    // This will be replaced with actual database queries when ADI functionality is implemented
    return NextResponse.json(placeholderADISubmissions);

  } catch (error) {
    console.error('ADI submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 