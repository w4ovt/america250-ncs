'use client';

import { useState, useEffect } from 'react';
import styles from './LogbookArchiveTable.module.css';

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
      <div className={styles.archiveSection}>
        <h2 className={styles.archiveTitle}>ADI Submission Log</h2>
        <p className={styles.archiveDescription}>All ADI file submissions and their processing results.</p>
        <div className={styles.loadingContainer}>
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.archiveSection}>
      <h2 className={styles.archiveTitle}>ADI Submission Log</h2>
      <p className={styles.archiveDescription}>All ADI file submissions and their processing results.</p>
      
      <div className={styles.searchSection}>
        <label htmlFor="archive-search" className="sr-only">Search submissions</label>
        <input
          type="text"
          id="archive-search"
          name="archive-search"
          placeholder="Search by filename, name, callsign, result, or file contents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {/* Desktop/Tablet Table Layout */}
      <div className={styles.archiveTableWrapper}>
        <table className={styles.archiveTable}>
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
                    <div className={styles.callsign}>{submission.submitterCall}</div>
                  </td>
                  <td>
                    <span className={`${styles.resultBadge} ${styles[submission.result.toLowerCase()]}`}>
                      {submission.result}
                    </span>
                  </td>
                  <td>{submission.recordCount}</td>
                  <td>{submitted.date}</td>
                  <td className={styles.timeUtc}>{submitted.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className={styles.mobileCards}>
        {filteredADISubmissions.map((submission) => {
          const submitted = formatDateTime(submission.submittedAt);
          
          return (
            <div key={submission.id} className={styles.mobileCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardFilename}>{submission.filename}</div>
                <span className={`${styles.resultBadge} ${styles[submission.result.toLowerCase()]}`}>
                  {submission.result}
                </span>
              </div>
              
              <div className={styles.cardDetails}>
                <div className={`${styles.cardField} ${styles.cardSubmitter}`}>
                  <div className={styles.cardFieldLabel}>Submitter</div>
                  <div className={styles.cardSubmitterName}>{submission.submitterName}</div>
                  <div className={styles.cardSubmitterCall}>{submission.submitterCall}</div>
                </div>
                
                <div className={styles.cardField}>
                  <div className={styles.cardFieldLabel}>Records</div>
                  <div className={styles.cardFieldValue}>{submission.recordCount}</div>
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={styles.cardDateTime}>
                  <div className={styles.cardDate}>{submitted.date}</div>
                  <div className={styles.cardTime}>{submitted.time}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 