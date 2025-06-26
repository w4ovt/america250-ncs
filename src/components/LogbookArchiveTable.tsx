'use client';

import { useState, useEffect } from 'react';

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

export default function LogbookArchiveTable() {
  const [adiSubmissions, setAdiSubmissions] = useState<ADISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    fetchADISubmissions();
  }, []);

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
    submission.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (submission.fileContent && submission.fileContent.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="archive-section">
        <h2 className="archive-title">ADI Submission Log</h2>
        <p className="archive-description">All ADI file submissions and their processing results.</p>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="archive-section">
      <h2 className="archive-title">ADI Submission Log</h2>
      <p className="archive-description">All ADI file submissions and their processing results.</p>
      
      <div className="search-section">
        <label htmlFor="archive-search" className="sr-only">Search submissions</label>
        <input
          type="text"
          id="archive-search"
          name="archive-search"
          placeholder="Search by filename, name, callsign, result, or file contents..."
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
  );
} 