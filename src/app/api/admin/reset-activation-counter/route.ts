import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { activations } from '../../../../db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { force = false } = body;

    // Check if there are existing activations
    const existingActivations = await db().select().from(activations);
    
    if (existingActivations.length > 0) {
      if (!force) {
        return NextResponse.json({
          error: 'Cannot reset counter: activations exist',
          message: 'There are existing activations in the database. Use force: true to delete all activations and reset the counter.',
          existingCount: existingActivations.length
        }, { status: 400 });
      }
      
      // Force mode: Delete all activations first
      await db().delete(activations);
      // Existing activations deleted
    }

    // Reset the activation_id sequence to 1
    await db().execute(`
      ALTER SEQUENCE activations_activation_id_seq RESTART WITH 1;
    `);
    
    return NextResponse.json({ 
      success: true, 
      message: force 
        ? `Reset successful: deleted ${existingActivations.length} activations and reset counter`
        : 'Activation counter reset successfully (no existing activations)',
      deletedCount: force ? existingActivations.length : 0
    });
    
  } catch (error) {
    console.error('Reset activation counter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 