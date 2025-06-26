'use client';

import { useState, useEffect } from 'react';
import ActivationArchiveTable from '../../components/ActivationArchiveTable';
import LogbookArchiveTable from '../../components/LogbookArchiveTable';

interface VolunteerData {
  pinId: number;
  role: 'admin' | 'volunteer';
  volunteer: {
    volunteerId: number;
    name: string;
    callsign: string;
    state: string;
  } | null;
}

export default function ArchivePage() {
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);

  // Check for admin authentication
  useEffect(() => {
    const stored = localStorage.getItem('volunteerAuth');
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        setVolunteerData(authData);
      } catch {
        // Invalid stored data, ignore
      }
    }
  }, []);

  const isAdmin = volunteerData?.role === 'admin';

  return (
    <main className="container">
      <h1 className="homepage-title">America250 NCS Archive</h1>
      <p className="homepage-subtitle">Historical Records & ADI Submissions</p>

      {/* Activation Archive Table */}
      <ActivationArchiveTable isAdmin={isAdmin} />

      {/* ADI Submission Log Archive */}
      <LogbookArchiveTable />
    </main>
  );
} 