const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or NEON_DATABASE_URL');
  process.exit(1);
}

const sql = neon(connectionString);

async function endTestActivations() {
  try {
    console.log('Ending test activations...');

    // Get all active activations (where ended_at is null)
    const activeActivations = await sql`
      SELECT a.activation_id, v.callsign, a.frequency_mhz, a.mode
      FROM activations a
      JOIN volunteers v ON a.volunteer_id = v.volunteer_id
      WHERE a.ended_at IS NULL
      ORDER BY a.started_at DESC
    `;

    console.log(`Found ${activeActivations.length} active activations`);

    // End all active activations
    const result = await sql`
      UPDATE activations 
      SET ended_at = NOW() 
      WHERE ended_at IS NULL
    `;

    console.log(`Ended ${result.count} activations successfully!`);

    // Show what was ended
    for (const activation of activeActivations) {
      console.log(`Ended: ${activation.callsign} on ${activation.frequency_mhz} ${activation.mode}`);
    }

    console.log('All test activations have been ended.');
    process.exit(0);

  } catch (error) {
    console.error('Error ending test activations:', error);
    process.exit(1);
  }
}

endTestActivations(); 