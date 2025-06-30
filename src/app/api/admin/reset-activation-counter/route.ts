import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';
import { isNull } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Add better error handling for request body parsing
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON in request body',
        message: 'The request body must be valid JSON'
      }, { status: 400 });
    }

    const { force = false } = body;

    // Check if there are currently running activations (ended_at is NULL)
    const runningActivations = await db()
      .select()
      .from(activations)
      .where(isNull(activations.endedAt));
    
    let deletedCount = 0;
    
    if (runningActivations.length > 0) {
      if (!force) {
        return NextResponse.json({
          error: 'Cannot reset counter: running activations exist',
          message: 'There are currently running activations. End all activations first, or use force: true to delete all activations and reset the counter.',
          runningCount: runningActivations.length
        }, { status: 400 });
      }
      
      // Force mode: Get total count of all activations before deleting
      const allActivations = await db().select().from(activations);
      deletedCount = allActivations.length;
      
      // Delete all activations
      await db().delete(activations);
      console.log(`Deleted all ${deletedCount} activations (including ${runningActivations.length} running ones)`);
    }

    // Reset the activation_id sequence to 1
    await db().execute(`
      ALTER SEQUENCE activations_activation_id_seq RESTART WITH 1;
    `);
    
    return NextResponse.json({ 
      success: true, 
      message: force 
        ? `Reset successful: deleted ${deletedCount} activations and reset counter`
        : 'Activation counter reset successfully (no running activations)',
      deletedCount: deletedCount
    });
    
  } catch (error) {
    console.error('Reset activation counter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 