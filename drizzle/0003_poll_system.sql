-- Poll System Migration
-- Supports both website visitor polls and volunteer polls

-- Poll definitions
CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poll_type TEXT NOT NULL CHECK (poll_type IN ('visitor', 'volunteer')),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option 1", "Option 2", "Option 3"]
  allow_multiple BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_by INTEGER REFERENCES volunteers(volunteer_id), -- NULL for visitor polls
  display_order INTEGER DEFAULT 0
);

-- Poll responses
CREATE TABLE poll_responses (
  id SERIAL PRIMARY KEY,
  poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
  volunteer_id INTEGER REFERENCES volunteers(volunteer_id), -- NULL for visitor responses
  response_data JSONB NOT NULL, -- {"selected_options": [0, 2], "text_response": "..."}
  ip_address INET, -- For visitor responses (anonymized)
  user_agent TEXT, -- For visitor responses
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_polls_active_type ON polls(is_active, poll_type);
CREATE INDEX idx_poll_responses_poll_id ON poll_responses(poll_id);
CREATE INDEX idx_poll_responses_volunteer_id ON poll_responses(volunteer_id);
CREATE INDEX idx_poll_responses_created_at ON poll_responses(created_at);

-- Sample data for testing
INSERT INTO polls (title, description, poll_type, question, options, allow_multiple, created_by, display_order) VALUES
('Website Experience', 'Help us improve your experience', 'visitor', 'How did you find our website?', 
 '["Search engine", "Social media", "Direct link", "Other"]', false, NULL, 1),
('Content Feedback', 'What content interests you most?', 'visitor', 'Which topics would you like to see more of?', 
 '["Historical events", "Technical articles", "Volunteer stories", "Event updates"]', true, NULL, 2),
('Volunteer Satisfaction', 'Event feedback for volunteers', 'volunteer', 'How would you rate your overall experience?', 
 '["Excellent", "Good", "Fair", "Poor"]', false, 1, 1),
('Technical Support', 'Volunteer technical feedback', 'volunteer', 'What technical challenges did you encounter?', 
 '["None", "Upload issues", "Interface problems", "Connection problems", "Other"]', true, 1, 2); 