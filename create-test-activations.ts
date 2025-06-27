import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { activations, volunteers, pins } from './src/db/schema';

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error('No database connection string found. Please set DATABASE_URL or NEON_DATABASE_URL');
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

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
      const [pin] = await db.insert(pins).values({
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        role: 'volunteer'
      }).returning();

      // Create the volunteer
      const [volunteer] = await db.insert(volunteers).values({
        pinId: pin.pinId,
        name: data.volunteer.name,
        callsign: data.volunteer.callsign,
        state: data.volunteer.state
      }).returning();

      // Create the activation
      const [activation] = await db.insert(activations).values({
        volunteerId: volunteer.volunteerId,
        frequencyMhz: data.activation.frequencyMhz,
        mode: data.activation.mode,
        startedAt: data.activation.startedAt
      }).returning();

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