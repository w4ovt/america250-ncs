#!/usr/bin/env node

// Pure JavaScript seed script - no TypeScript compilation needed
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config({ path: '.env.local' });

async function seed() {
  try {
    console.log('🌱 Seeding database with admin user...');
    
    // Get database connection
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No database connection string provided. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.');
    }
    
    const sql = neon(connectionString);
    const db = drizzle(sql);
    
    // Insert Marc Bowen as admin using raw SQL to avoid schema import issues
    const result = await sql`
      INSERT INTO volunteers (name, callsign, state, pin, role, created_at)
      VALUES ('Marc Bowen', 'W4OVT', 'NC', '7317', 'admin', NOW())
      RETURNING volunteer_id, name, callsign, state, pin, role, created_at;
    `;
    
    console.log('✅ Admin user created:', result[0]);
    console.log('🎯 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed
seed().then(() => {
  console.log('✅ Seed completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
}); 