'use client';

import { useState } from 'react';
import styles from './TestPolls.module.css';

export default function TestPollsPage() {
  const [volunteerId, setVolunteerId] = useState<number>(1);
  const [showVisitorPoll, setShowVisitorPoll] = useState(true);
  const [showVolunteerPoll, setShowVolunteerPoll] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Poll System Test Page</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Volunteer ID (for volunteer polls):</label>
            <input
              type="number"
              value={volunteerId}
              onChange={(e) => setVolunteerId(parseInt(e.target.value) || 1)}
              className="border rounded px-3 py-2 w-32"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showVisitorPoll}
                onChange={(e) => setShowVisitorPoll(e.target.checked)}
                className={styles.mahoganyCheckbox}
              />
              Show Visitor Poll
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showVolunteerPoll}
                onChange={(e) => setShowVolunteerPoll(e.target.checked)}
                className={styles.mahoganyCheckbox}
              />
              Show Volunteer Poll
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {showVisitorPoll && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Visitor Poll Test</h2>
            <div>
              <h3 className="text-lg font-semibold mb-2">Testing Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Make sure the database migration has been applied (drizzle/0003_poll_system.sql)</li>
                <li>The migration includes sample polls for both visitor and volunteer types</li>
                <li>Try submitting responses and check the browser console for any errors</li>
                <li>Check the database to see if responses are being saved</li>
                <li>Use the API endpoints directly: GET /api/polls?type=visitor or /api/polls?type=volunteer</li>
              </ul>
            </div>
          </div>
        )}

        {showVolunteerPoll && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Volunteer Poll Test</h2>
            <div>
              <h3 className="text-lg font-semibold mb-2">Testing Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Make sure the database migration has been applied (drizzle/0003_poll_system.sql)</li>
                <li>The migration includes sample polls for both visitor and volunteer types</li>
                <li>Try submitting responses and check the browser console for any errors</li>
                <li>Check the database to see if responses are being saved</li>
                <li>Use the API endpoints directly: GET /api/polls?type=visitor or /api/polls?type=volunteer</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Make sure the database migration has been applied (drizzle/0003_poll_system.sql)</li>
          <li>The migration includes sample polls for both visitor and volunteer types</li>
          <li>Try submitting responses and check the browser console for any errors</li>
          <li>Check the database to see if responses are being saved</li>
          <li>Use the API endpoints directly: GET /api/polls?type=visitor or /api/polls?type=volunteer</li>
        </ul>
      </div>
    </div>
  );
} 