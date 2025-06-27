const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or NEON_DATABASE_URL');
  process.exit(1);
}

const sql = neon(connectionString);

async function checkRemainingData() {
  try {
    console.log('Checking remaining data...\n');

    // Check all volunteers
    const volunteers = await sql`
      SELECT volunteer_id, name, callsign, state, pin_id
      FROM volunteers 
      ORDER BY volunteer_id
    `;
    console.log(`Volunteers (${volunteers.length}):`);
    volunteers.forEach(v => console.log(`  ${v.volunteer_id}: ${v.callsign} - ${v.name} (${v.state}) - PIN: ${v.pin_id}`));

    // Check all activations
    const activations = await sql`
      SELECT activation_id, volunteer_id, frequency_mhz, mode, started_at, ended_at
      FROM activations 
      ORDER BY activation_id
    `;
    console.log(`\nActivations (${activations.length}):`);
    activations.forEach(a => console.log(`  ${a.activation_id}: Volunteer ${a.volunteer_id} - ${a.frequency_mhz} ${a.mode} - Started: ${a.started_at} - Ended: ${a.ended_at}`));

    // Check all PINs
    const pins = await sql`
      SELECT pin_id, pin, role, created_at
      FROM pins 
      ORDER BY pin_id
    `;
    console.log(`\nPINs (${pins.length}):`);
    pins.forEach(p => console.log(`  ${p.pin_id}: ${p.pin} (${p.role}) - Created: ${p.created_at}`));

    // Find orphaned PINs (PINs without volunteers)
    const orphanedPins = await sql`
      SELECT p.pin_id, p.pin, p.role
      FROM pins p
      LEFT JOIN volunteers v ON p.pin_id = v.pin_id
      WHERE v.volunteer_id IS NULL
      ORDER BY p.pin_id
    `;
    console.log(`\nOrphaned PINs (${orphanedPins.length}):`);
    orphanedPins.forEach(p => console.log(`  ${p.pin_id}: ${p.pin} (${p.role})`));

    process.exit(0);

  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
}

checkRemainingData(); 