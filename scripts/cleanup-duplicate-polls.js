const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function cleanupDuplicatePolls() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🧹 Cleaning up duplicate polls...\n');
    
    // Find and remove duplicate polls
    const duplicates = await sql`
      DELETE FROM polls 
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
                 ROW_NUMBER() OVER (
                   PARTITION BY title, poll_type, question 
                   ORDER BY id
                 ) as rn
          FROM polls
        ) t
        WHERE t.rn > 1
      )
      RETURNING *
    `;
    
    console.log(`✅ Removed ${duplicates.length} duplicate polls`);
    
    // Show remaining polls
    const remainingPolls = await sql`SELECT * FROM polls ORDER BY poll_type, display_order`;
    console.log(`\n📋 Remaining polls (${remainingPolls.length}):`);
    remainingPolls.forEach(poll => {
      console.log(`   - ${poll.title} (${poll.poll_type}): "${poll.question}"`);
    });

  } catch (error) {
    console.error('❌ Error cleaning up polls:', error);
  }
}

cleanupDuplicatePolls(); 