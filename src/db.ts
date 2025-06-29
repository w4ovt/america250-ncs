import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load environment variables from .env.local
config({ path: '.env.local' });

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    // Support multiple environment variable names for flexibility
    // Primary: DATABASE_URL (Vercel standard)
    // Fallback: NEON_DATABASE_URL (legacy support)
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        'No database connection string provided. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.\n' +
        'Expected format: postgresql://[user]:[password]@[host]/[database]'
      );
    }
    const sql = neon(connectionString);
    _db = drizzle(sql);
  }
  return _db;
}

export { getDb as db }; 