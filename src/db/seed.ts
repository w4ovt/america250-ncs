import { db } from '../db';
import { volunteers } from './schema';

export async function seed() {
  try {
    console.log('🌱 Seeding database with admin user...');
    
    // Insert Marc Bowen as admin
    const adminUser = await db().insert(volunteers).values({
      name: 'Marc Bowen',
      callsign: 'W4OVT',
      state: 'NC',
      pin: '7317',
      role: 'admin',
    }).returning();
    
    console.log('✅ Admin user created:', adminUser[0]);
    console.log('🎯 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
} 