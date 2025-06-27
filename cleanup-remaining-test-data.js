const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or NEON_DATABASE_URL');
  process.exit(1);
}

const sql = neon(connectionString);

async function cleanupRemainingTestData() {
  try {
    console.log('Cleaning up remaining test data...');

    // Get the remaining test volunteers
    const testVolunteers = await sql`
      SELECT volunteer_id, name, callsign, pin_id
      FROM volunteers 
      WHERE callsign IN ('KX4PZ', 'K4AX')
      ORDER BY volunteer_id
    `;

    console.log(`Found ${testVolunteers.length} remaining test volunteers to clean up`);

    for (const volunteer of testVolunteers) {
      console.log(`Cleaning up volunteer: ${volunteer.callsign} (${volunteer.name})`);
      
      // 1. Delete any activations for this volunteer
      const activationResult = await sql`
        DELETE FROM activations 
        WHERE volunteer_id = ${volunteer.volunteer_id}
      `;
      console.log(`  - Deleted ${activationResult.count} activations`);

      // 2. Delete the volunteer
      const volunteerResult = await sql`
        DELETE FROM volunteers 
        WHERE volunteer_id = ${volunteer.volunteer_id}
      `;
      console.log(`  - Deleted volunteer`);

      // 3. Delete the PIN
      const pinResult = await sql`
        DELETE FROM pins 
        WHERE pin_id = ${volunteer.pin_id}
      `;
      console.log(`  - Deleted PIN`);
    }

    console.log('Remaining test data cleanup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error cleaning up remaining test data:', error);
    process.exit(1);
  }
}

cleanupRemainingTestData(); 