'use client';

import { useState, useEffect } from 'react';

interface ArchivedActivation {
  activationId: number;
  frequencyMhz: number;
  mode: string;
  name: string;
  callsign: string;
  state: string;
  startedAt: string;
  endedAt: string;
}

interface ADISubmission {
  id: number;
  filename: string;
  submitterName: string;
  submitterCall: string;
  result: 'Success' | 'Failure';
  recordCount: number;
  submittedAt: string;
  fileContent?: string;
}

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

type SortField = 'activationId' | 'frequencyMhz' | 'mode' | 'name' | 'callsign' | 'state' | 'startedAt' | 'endedAt';
type SortDirection = 'asc' | 'desc';

export default function ArchivePage() {
  const [archivedActivations, setArchivedActivations] = useState<ArchivedActivation[]>([]);
  const [adiSubmissions, setAdiSubmissions] = useState<ADISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('endedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const fetchArchivedActivations = async () => {
    try {
      const response = await fetch('/api/activations/archive');
      if (response.ok) {
        const data = await response.json();
        setArchivedActivations(data);
      }
    } catch (error) {
      console.error('Failed to fetch archived activations:', error);
    }
  };

  const fetchADISubmissions = async () => {
    try {
      const response = await fetch('/api/adi/submissions');
      if (response.ok) {
        const data = await response.json();
        setAdiSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to fetch ADI submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedActivations();
    fetchADISubmissions();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        timeZone: 'UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' UTC'
    };
  };

  const filteredADISubmissions = adiSubmissions.filter(submission =>
    submission.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.submitterCall.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedArchivedActivations = [...archivedActivations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    if (volunteerData?.role !== 'admin') {
      return <th>{children}</th>;
    }
    
    return (
      <th 
        className="sortable-header"
        onClick={() => handleSort(field)}
      >
        {children}
        {sortField === field && (
          <span className="sort-indicator">
            {sortDirection === 'asc' ? ' ↑' : ' ↓'}
          </span>
        )}
      </th>
    );
  };

  if (isLoading) {
    return (
      <main className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading archive...
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="homepage-title">America250 NCS Archive</h1>
      <p className="homepage-subtitle">Historical Records & ADI Submissions</p>

      {/* Activation Archive Table */}
      <div className="archive-section">
        <h2 className="archive-title">Activation Archive</h2>
        <p className="archive-description">All ended activations from the America250 NCS event.</p>
        
        <div className="archive-table-wrapper">
          <table className="archive-table">
            <thead>
              <tr>
                <SortableHeader field="activationId">ID</SortableHeader>
                <SortableHeader field="frequencyMhz">Frequency</SortableHeader>
                <SortableHeader field="mode">Mode</SortableHeader>
                <SortableHeader field="name">Name</SortableHeader>
                <SortableHeader field="callsign">Callsign</SortableHeader>
                <SortableHeader field="state">State</SortableHeader>
                <SortableHeader field="startedAt">Started</SortableHeader>
                <SortableHeader field="endedAt">Ended</SortableHeader>
              </tr>
            </thead>
            <tbody>
              {sortedArchivedActivations.map((activation) => {
                const started = formatDateTime(activation.startedAt);
                const ended = formatDateTime(activation.endedAt);
                
                return (
                  <tr key={activation.activationId}>
                    <td>{activation.activationId}</td>
                    <td>{activation.frequencyMhz.toFixed(3)}</td>
                    <td>{activation.mode}</td>
                    <td>{activation.name}</td>
                    <td>{activation.callsign}</td>
                    <td>{activation.state}</td>
                    <td>
                      <div>{started.date}</div>
                      <div className="time-utc">{started.time}</div>
                    </td>
                    <td>
                      <div>{ended.date}</div>
                      <div className="time-utc">{ended.time}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADI Submission Log Archive */}
      <div className="archive-section">
        <h2 className="archive-title">ADI Submission Log</h2>
        <p className="archive-description">All ADI file submissions and their processing results.</p>
        
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by filename, name, callsign, or result..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="archive-table-wrapper">
          <table className="archive-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Submitter</th>
                <th>Result</th>
                <th>Records</th>
                <th>Date</th>
                <th>Time (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {filteredADISubmissions.map((submission) => {
                const submitted = formatDateTime(submission.submittedAt);
                
                return (
                  <tr key={submission.id}>
                    <td>{submission.filename}</td>
                    <td>
                      <div>{submission.submitterName}</div>
                      <div className="callsign">{submission.submitterCall}</div>
                    </td>
                    <td>
                      <span className={`result-badge ${submission.result.toLowerCase()}`}>
                        {submission.result}
                      </span>
                    </td>
                    <td>{submission.recordCount}</td>
                    <td>{submitted.date}</td>
                    <td className="time-utc">{submitted.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 