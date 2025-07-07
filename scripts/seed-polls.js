const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function seedPolls() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Seeding polls...');
    
    // Sample poll data
    const samplePolls = [
      {
        title: 'Website Experience',
        description: 'Help us improve your experience',
        poll_type: 'visitor',
        question: 'How did you find our website?',
        options: JSON.stringify(['Search engine', 'Social media', 'Direct link', 'Other']),
        allow_multiple: false,
        display_order: 1
      },
      {
        title: 'Content Feedback',
        description: 'What content interests you most?',
        poll_type: 'visitor',
        question: 'Which topics would you like to see more of?',
        options: JSON.stringify(['Historical events', 'Technical articles', 'Volunteer stories', 'Event updates']),
        allow_multiple: true,
        display_order: 2
      },
      {
        title: 'Volunteer Satisfaction',
        description: 'Event feedback for volunteers',
        poll_type: 'volunteer',
        question: 'How would you rate your overall experience?',
        options: JSON.stringify(['Excellent', 'Good', 'Fair', 'Poor']),
        allow_multiple: false,
        display_order: 1
      },
      {
        title: 'Technical Support',
        description: 'Volunteer technical feedback',
        poll_type: 'volunteer',
        question: 'What technical challenges did you encounter?',
        options: JSON.stringify(['None', 'Upload issues', 'Interface problems', 'Connection problems', 'Other']),
        allow_multiple: true,
        display_order: 2
      }
    ];

    for (const poll of samplePolls) {
      await sql`
        INSERT INTO polls (title, description, poll_type, question, options, allow_multiple, display_order)
        VALUES (${poll.title}, ${poll.description}, ${poll.poll_type}, ${poll.question}, ${poll.options}, ${poll.allow_multiple}, ${poll.display_order})
        ON CONFLICT DO NOTHING
      `;
    }

    console.log('✅ Sample polls created successfully!');
    
    // Show the created polls
    const polls = await sql`SELECT * FROM polls ORDER BY poll_type, display_order`;
    console.log('\nCreated polls:');
    polls.forEach(poll => {
      console.log(`- ${poll.title} (${poll.poll_type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding polls:', error);
  }
}

seedPolls(); 