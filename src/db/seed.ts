import { db } from '../db';
import { pins, volunteers } from './schema';

async function seed() {
  try {
    // Insert PINs
    const [marcPin] = await db().insert(pins).values({ pin: '7317', role: 'admin' }).returning();
    const [stanPin] = await db().insert(pins).values({ pin: '7373', role: 'volunteer' }).returning();

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