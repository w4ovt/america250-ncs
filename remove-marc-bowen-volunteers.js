const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const ADMIN_PIN = 7317;

async function removeMarcBowenVolunteers() {
  try {
    console.log('🔍 Searching for K4A - Marc Bowen volunteers in GA (excluding admin PIN 7317)...');
    
    // Find the volunteers (excluding admin)
    const marcBowenVolunteers = await sql`
      SELECT * FROM volunteers 
      WHERE callsign LIKE 'K4A%' 
      AND name LIKE '%Marc Bowen%' 
      AND state = 'GA'
      AND pin_id != ${ADMIN_PIN}
    `;
    
    console.log('Raw volunteer rows:', marcBowenVolunteers);
    console.log(`Found ${marcBowenVolunteers.length} K4A - Marc Bowen volunteers in GA (excluding admin):`);
    marcBowenVolunteers.forEach(v => {
      console.log(`  - volunteer_id: ${v.volunteer_id}, Callsign: ${v.callsign}, Name: ${v.name}, State: ${v.state}, pin_id: ${v.pin_id}`);
    });
    
    if (marcBowenVolunteers.length === 0) {
      console.log('✅ No K4A - Marc Bowen volunteers found in GA (excluding admin)');
      return;
    }
    
    // Get their volunteer_ids and pin_ids
    const volunteerIds = marcBowenVolunteers.map(v => v.volunteer_id);
    const pinIds = marcBowenVolunteers.map(v => v.pin_id);
    
    console.log('\n🗑️  Removing related data...');
    
    // Remove related activations
    await sql`
      DELETE FROM activations 
      WHERE volunteer_id = ANY(${volunteerIds})
    `;
    console.log('  - Removed activations');
    
    // Remove related ADI submissions
    await sql`
      DELETE FROM adi_submissions 
      WHERE volunteer_id = ANY(${volunteerIds})
    `;
    console.log('  - Removed ADI submissions');
    
    // Remove the volunteers
    await sql`
      DELETE FROM volunteers 
      WHERE volunteer_id = ANY(${volunteerIds})
    `;
    console.log('  - Removed volunteers');
    
    // Now, for each pin_id, check if any volunteers still reference it
    for (const pinId of pinIds) {
      const stillReferenced = await sql`
        SELECT COUNT(*) FROM volunteers WHERE pin_id = ${pinId}
      `;
      const count = parseInt(stillReferenced[0].count || stillReferenced[0].count_ || '0', 10);
      if (count === 0) {
        await sql`
          DELETE FROM pins WHERE pin_id = ${pinId}
        `;
        console.log(`  - Removed pin_id ${pinId}`);
      } else {
        console.log(`  - pin_id ${pinId} still referenced by ${count} volunteer(s), not removed`);
      }
    }
    
    console.log('\n✅ Successfully removed K4A - Marc Bowen volunteers in GA (excluding admin) and all related data');
    
  } catch (error) {
    console.error('❌ Error removing volunteers:', error);
  } finally {
    process.exit(0);
  }
}

removeMarcBowenVolunteers(); 