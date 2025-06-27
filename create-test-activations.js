const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or NEON_DATABASE_URL');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

// Define schema tables manually for CommonJS
const pins = { tableName: 'pins' };
const volunteers = { tableName: 'volunteers' };
const activations = { tableName: 'activations' };

async function createTestActivations() {
  try {
    console.log('Creating test activations...');

    // Provided test data
    const testData = [
      {
        volunteer: { name: 'Bill', callsign: 'K4NNP', state: 'NC' },
        activation: { frequencyMhz: '7.190', mode: 'CW', startedAt: new Date(Date.now() - 20 * 60 * 1000) }
      },
      {
        volunteer: { name: 'Stan', callsign: 'WA4RDZ', state: 'NC' },
        activation: { frequencyMhz: '14.078', mode: 'FT8', startedAt: new Date(Date.now() - 15 * 60 * 1000) }
      },
      {
        volunteer: { name: 'Mark', callsign: 'KX4PZ', state: 'NC' },
        activation: { frequencyMhz: '145.250', mode: 'FM', startedAt: new Date(Date.now() - 10 * 60 * 1000) }
      },
      {
        volunteer: { name: 'Jesse', callsign: 'K4AX', state: 'NC' },
        activation: { frequencyMhz: '28.150', mode: 'PSK31', startedAt: new Date(Date.now() - 5 * 60 * 1000) }
      }
    ];

    for (const data of testData) {
      // Create a PIN for the volunteer
      const pinResult = await sql`
        INSERT INTO pins (pin, role) 
        VALUES (${Math.floor(1000 + Math.random() * 9000).toString()}, 'volunteer') 
        RETURNING pin_id
      `;
      const pinId = pinResult[0].pin_id;

      // Create the volunteer
      const volunteerResult = await sql`
        INSERT INTO volunteers (pin_id, name, callsign, state) 
        VALUES (${pinId}, ${data.volunteer.name}, ${data.volunteer.callsign}, ${data.volunteer.state}) 
        RETURNING volunteer_id
      `;
      const volunteerId = volunteerResult[0].volunteer_id;

      // Create the activation
      const activationResult = await sql`
        INSERT INTO activations (volunteer_id, frequency_mhz, mode, started_at) 
        VALUES (${volunteerId}, ${data.activation.frequencyMhz}, ${data.activation.mode}, ${data.activation.startedAt}) 
        RETURNING activation_id
      `;

      console.log(`Created activation: ${data.volunteer.callsign} on ${data.activation.frequencyMhz} ${data.activation.mode}`);
    }

    console.log('Test activations created successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error creating test activations:', error);
    process.exit(1);
  }
}

createTestActivations(); 