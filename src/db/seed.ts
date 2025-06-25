import { db } from '../db';
import { pins, volunteers } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  // Insert PINs
  await db.insert(pins).values([
    { pin: '7317', role: 'admin' },
    { pin: '7373', role: 'volunteer' }
  ]);

  // Get PIN IDs
  const marcPin = (await db.select().from(pins).where(eq(pins.pin, '7317')))[0];
  const stanPin = (await db.select().from(pins).where(eq(pins.pin, '7373')))[0];

  if (!marcPin || !stanPin) {
    throw new Error('PIN insertion failed.');
  }

  // Insert Volunteers
  await db.insert(volunteers).values([
    {
      name: 'Marc Bowen',
      callsign: 'W4OVT',
      state: 'NC',
      pinId: marcPin.pinId
    },
    {
      name: 'Stan Overby',
      callsign: 'WA4RDZ',
      state: 'NC',
      pinId: stanPin.pinId
    }
  ]);

  console.log('✅ Seed complete.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
}); 