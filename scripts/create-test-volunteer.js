const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function createTestVolunteer() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Creating test volunteer...');
    
    // Create a test volunteer
    const testVolunteer = {
      name: 'Test Volunteer',
      callsign: 'TEST1',
      state: 'VA',
      pin: '1234',
      role: 'volunteer'
    };

    const result = await sql`
      INSERT INTO volunteers (name, callsign, state, pin, role)
      VALUES (${testVolunteer.name}, ${testVolunteer.callsign}, ${testVolunteer.state}, ${testVolunteer.pin}, ${testVolunteer.role})
      ON CONFLICT (pin) DO NOTHING
      RETURNING *
    `;

    if (result.length > 0) {
      console.log('✅ Test volunteer created successfully!');
      console.log('Test volunteer details:');
      console.log(`- Name: ${result[0].name}`);
      console.log(`- Callsign: ${result[0].callsign}`);
      console.log(`- State: ${result[0].state}`);
      console.log(`- PIN: ${result[0].pin}`);
      console.log(`- Role: ${result[0].role}`);
    } else {
      console.log('ℹ️ Test volunteer already exists');
    }

  } catch (error) {
    console.error('❌ Error creating test volunteer:', error);
  }
}

createTestVolunteer(); 