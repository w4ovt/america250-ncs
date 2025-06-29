import { db } from '../db';
import { pins, volunteers } from './schema';

async function seed() {
  try {
    // Insert PINs
    const marcPinResult = await db().insert(pins).values({ pin: '7317', role: 'admin' }).returning();
    const stanPinResult = await db().insert(pins).values({ pin: '7373', role: 'volunteer' }).returning();

    const marcPin = marcPinResult[0];
    const stanPin = stanPinResult[0];

    if (!marcPin || !stanPin) {
      throw new Error('Failed to create PINs');
    }

    // Insert volunteers
    await db().insert(volunteers).values({
      pinId: marcPin.pinId,
      name: 'Marc Bowen',
      callsign: 'W4OVT',
      state: 'NC',
    });
    await db().insert(volunteers).values({
      pinId: stanPin.pinId,
      name: 'Stan Overby',
      callsign: 'WA4RDZ',
      state: 'NC',
    });

    console.log('Seed complete');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 