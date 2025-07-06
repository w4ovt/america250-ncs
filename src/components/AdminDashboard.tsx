'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './AdminDashboard.module.css';
import VolunteerManagement from './VolunteerManagement';

interface Volunteer {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
  pin: string;
  role: string;
}

interface Activation {
  activationId: number;
  frequencyMhz: number;
  mode: string;
  startedAt: string;
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
}

interface AdiSubmission {
  id: number;
  submittedAt: string;
  filename: string;
  fileContent: string;
  recordCount: number;
  processedCount: number;
  status: string;
  volunteerName: string;
  volunteerCallsign: string;
  volunteerState: string;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [adiSubmissions, setAdiSubmissions] = useState<AdiSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingActivation, setIsCreatingActivation] = useState(false);
  const [isEndingActivation, setIsEndingActivation] = useState<number | null>(null);
  const [isResettingCounter, setIsResettingCounter] = useState(false);
  const [isDeletingSubmission, setIsDeletingSubmission] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionSortBy, setSubmissionSortBy] = useState('submittedAt');
  const [submissionSortOrder, setSubmissionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<AdiSubmission | null>(null);
  
  // Create activation form state
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | ''>('');
  const [activationFrequency, setActivationFrequency] = useState('');
  const [activationMode, setActivationMode] = useState('');

  const handleFrequencyChange = (value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // If the value is empty, just set it
    if (!cleanValue) {
      setActivationFrequency('');
      return;
    }
    
    // If it's already a decimal number (like 7.074), keep it as is
    if (cleanValue.includes('.')) {
      setActivationFrequency(cleanValue);
      return;
    }
    
    // If it's a whole number, assume it's kHz and convert to MHz
    const numValue = parseInt(cleanValue, 10);
    if (numValue >= 1800 && numValue <= 148000) { // Valid kHz range (1.8-148 MHz)
      const mhzValue = (numValue / 1000).toFixed(3);
      setActivationFrequency(mhzValue);
    } else {
      // If it's not in valid range, just set the raw value
      setActivationFrequency(cleanValue);
    }
  };

  const [spotStatus, setSpotStatus] = useState<Record<number, string>>({});
  const [spotResponse, setSpotResponse] = useState<Record<number, string>>({});
  const [spotComment, setSpotComment] = useState<Record<number, string>>({});
  const [spotCooldown, setSpotCooldown] = useState<Record<string, number>>({});

  const fetchVolunteers = async () => {
    try {
      // Get auth data from localStorage as fallback
      const stored = localStorage.getItem('volunteerAuth');
      const authData = stored ? JSON.parse(stored) : null;
      
      const headers: Record<string, string> = {};
      
      // Add auth data to headers as fallback
      if (authData) {
        headers['x-volunteer-auth'] = encodeURIComponent(JSON.stringify(authData));
      }
      
      const response = await fetch('/api/admin/volunteers', { 
        credentials: 'include',
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data);
      } else {
        setErrorMessage('Failed to load volunteers');
      }
    } catch {
      setErrorMessage('Network error loading volunteers');
    }
  };

  const fetchActivations = async () => {
    try {
      const response = await fetch('/api/activations/list');
      if (response.ok) {
        const data = await response.json();
        setActivations(data);
      } else {
        setErrorMessage('Failed to load activations');
      }
    } catch {
      setErrorMessage('Network error loading activations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdiSubmissions = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: submissionSearch,
        sortBy: submissionSortBy,
        sortOrder: submissionSortOrder
      });
      
      const response = await fetch(`/api/admin/adi-submissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAdiSubmissions(data);
      } else {
        setErrorMessage('Failed to load ADI submissions');
      }
    } catch {
      setErrorMessage('Network error loading ADI submissions');
    }
  }, [submissionSearch, submissionSortBy, submissionSortOrder]);

  useEffect(() => {
    fetchVolunteers();
    fetchActivations();
    fetchAdiSubmissions();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchVolunteers();
      fetchActivations();
      fetchAdiSubmissions();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [submissionSearch, submissionSortBy, submissionSortOrder, fetchAdiSubmissions]);

  // Cooldown timer for Re-spot per activation
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    Object.entries(spotCooldown).forEach(([id, cooldown]) => {
      if (cooldown > 0) {
        timers.push(setTimeout(() => {
          setSpotCooldown(prev => ({ ...prev, [id]: (prev[id] ?? 0) - 1 }));
        }, 1000));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [spotCooldown]);

  const handleCreateActivation = async () => {
    if (!selectedVolunteerId || !activationFrequency || !activationMode) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsCreatingActivation(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/activations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteerId: selectedVolunteerId,
          frequencyMhz: Number(activationFrequency),
          mode: activationMode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Activation created successfully for ${data.activation.activationId}`);
        // Reset form
        setSelectedVolunteerId('');
        setActivationFrequency('');
        setActivationMode('');
        fetchActivations(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create activation');
      }
    } catch {
      setErrorMessage('Network error creating activation');
    } finally {
      setIsCreatingActivation(false);
    }
  };

  const handleEndActivation = async (activationId: number, callsign: string) => {
    setIsEndingActivation(activationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/activations/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activationId }),
      });

      if (response.ok) {
        setSuccessMessage(`Activation ${activationId} ended successfully for ${callsign}`);
        fetchActivations(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to end activation');
      }
    } catch {
      setErrorMessage('Network error ending activation');
    } finally {
      setIsEndingActivation(null);
    }
  };

  const handleResetActivationCounter = async () => {
    if (!confirm('Are you sure you want to reset the activation counter? This will reset the next activation ID to 1.')) {
      return;
    }

    setIsResettingCounter(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // First try a safe reset (no force)
      const response = await fetch('/api/admin/reset-activation-counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: false }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message);
        fetchActivations(); // Refresh the list
      } else {
        const errorData = await response.json();
        
        // If there are running activations, ask user if they want to force delete them
        if (errorData.error === 'Cannot reset counter: running activations exist') {
          const forceConfirm = confirm(
            `There are ${errorData.runningCount} currently running activations. Do you want to DELETE ALL ACTIVATIONS and reset the counter? This action cannot be undone.`
          );
          
          if (forceConfirm) {
            const forceResponse = await fetch('/api/admin/reset-activation-counter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ force: true }),
            });

            if (forceResponse.ok) {
              const forceData = await forceResponse.json();
              setSuccessMessage(forceData.message);
              fetchActivations(); // Refresh the list
            } else {
              const forceErrorData = await forceResponse.json();
              setErrorMessage(forceErrorData.error || 'Failed to force reset counter');
            }
          }
        } else {
          setErrorMessage(errorData.error || 'Failed to reset counter');
        }
      }
    } catch {
      setErrorMessage('Network error resetting counter');
    } finally {
      setIsResettingCounter(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: number) => {
    if (!confirm('Are you sure you want to delete this ADI submission? This action cannot be undone.')) {
      return;
    }

    setIsDeletingSubmission(submissionId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/admin/adi-submissions?id=${submissionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('ADI submission deleted successfully');
        fetchAdiSubmissions(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete ADI submission');
      }
    } catch {
      setErrorMessage('Network error deleting ADI submission');
    } finally {
      setIsDeletingSubmission(null);
    }
  };

  // Remove legacy DXSummit spot handler and UI
  // Add new cluster spot handler
  const handleClusterSpot = async (activation: Activation) => {
    setSpotStatus(prev => ({ ...prev, [activation.activationId]: 'Sending spot to cluster...' }));
    setSpotResponse(prev => ({ ...prev, [activation.activationId]: '' }));
    try {
      const myCall = activation.callsign;
      const dxCall = activation.callsign;
      const freq = (activation.frequencyMhz * 1000).toFixed(0); // kHz
      const info = spotComment[activation.activationId] || 'AMERICA250 SES';
      const res = await fetch('/api/cluster-spot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myCall, dxCall, freq, info })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'No JSON response from server', raw: await res.text() };
      }
      if (res.ok && data.success) {
        setSpotStatus(prev => ({ ...prev, [activation.activationId]: '✅ Spot sent to cluster and accepted!' }));
        setSpotResponse(prev => ({ ...prev, [activation.activationId]: JSON.stringify(data, null, 2) }));
        setSpotCooldown(prev => ({ ...prev, [activation.activationId]: 600 })); // 10 min cooldown
      } else {
        setSpotStatus(prev => ({ ...prev, [activation.activationId]: '❌ Spot not confirmed: ' + (data.error || 'Unknown error') }));
        setSpotResponse(prev => ({ ...prev, [activation.activationId]: JSON.stringify(data, null, 2) }));
      }
    } catch (err) {
      setSpotStatus(prev => ({ ...prev, [activation.activationId]: '❌ Error sending spot to cluster.' }));
      setSpotResponse(prev => ({ ...prev, [activation.activationId]: String(err) }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.adminDashboard}>
        <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '300px', height: '2rem', marginBottom: '2rem' }}></div>
        
        {/* Reset Counter Section Skeleton */}
        <div className={styles.adminSection}>
          <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '200px', height: '1.5rem', marginBottom: '1rem' }}></div>
          <div className={styles.centeredBlock}>
            <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '250px', height: '2.5rem', borderRadius: '6px' }}></div>
          </div>
        </div>

        {/* End Activations Table Skeleton */}
        <div className={styles.adminSection}>
          <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '150px', height: '1.5rem', marginBottom: '1rem' }}></div>
          <div className={styles.activationsTableWrapper}>
            <table className="skeleton-table">
              <thead>
                <tr>
                  <th><div className="skeleton skeleton-text short"></div></th>
                  <th><div className="skeleton skeleton-text medium"></div></th>
                  <th><div className="skeleton skeleton-text medium"></div></th>
                  <th><div className="skeleton skeleton-text short"></div></th>
                  <th><div className="skeleton skeleton-text medium"></div></th>
                  <th><div className="skeleton skeleton-text short"></div></th>
                  <th><div className="skeleton skeleton-text short"></div></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                    <td><div className="skeleton-cell"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Activation Form Skeleton */}
        <div className={styles.adminSection}>
          <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '150px', height: '1.5rem', marginBottom: '1rem' }}></div>
          <div className={styles.pinCreateForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <div className="skeleton skeleton-text short" style={{ marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ height: '2.5rem' }}></div>
              </div>
              <div className={styles.formGroup}>
                <div className="skeleton skeleton-text short" style={{ marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ height: '2.5rem' }}></div>
              </div>
              <div className={styles.formGroup}>
                <div className="skeleton skeleton-text short" style={{ marginBottom: '0.5rem' }}></div>
                <div className="skeleton skeleton-text" style={{ height: '2.5rem' }}></div>
              </div>
              <div className={styles.formGroup}>
                <div className="skeleton skeleton-text" style={{ height: '2.5rem', marginTop: '1.5rem' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Management Skeleton */}
        <div className={styles.adminSection}>
          <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '200px', height: '1.5rem', marginBottom: '1rem' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '400px', borderRadius: '6px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <h2 className={styles.adminTitle}>Admin Dashboard</h2>
      
      {onLogout && (
        <button 
          onClick={onLogout} 
          className="btn btn-secondary"
        >
          Logout
        </button>
      )}
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Reset Activation Counter Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Reset Activation Counter</h3>
        <div className={styles.resetCounterSection + ' ' + styles.centeredBlock}>
          <button
            onClick={handleResetActivationCounter}
            disabled={isResettingCounter}
            className="btn btn-danger"
          >
            {isResettingCounter ? (
              <>
                <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
                Resetting...
              </>
            ) : 'Reset Activation Counter to 0'}
          </button>
          <span className={styles.resetWarning + ' ' + styles.centeredText}>
            IMPORTANT: End All Activations Before Resetting Activation Numbering. Use this when the event goes live to reset activation numbering
          </span>
        </div>
      </div>

      {/* End Activations Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>End Activations</h3>
        <div className={styles.activationsTableWrapper}>
          <table className={styles.activationsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Volunteer</th>
                <th>Callsign</th>
                <th>State</th>
                <th>Frequency</th>
                <th>Mode</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activations.map((activation) => (
                <tr key={activation.activationId}>
                  <td>{activation.activationId}</td>
                  <td>{activation.name}</td>
                  <td>{activation.callsign}</td>
                  <td>{activation.state}</td>
                  <td>{activation.frequencyMhz} MHz</td>
                  <td>{activation.mode}</td>
                  <td>
                    <button
                      onClick={() => handleEndActivation(activation.activationId, activation.callsign)}
                      disabled={isEndingActivation === activation.activationId}
                      className="btn btn-danger"
                      style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
                    >
                      {isEndingActivation === activation.activationId ? 'Ending...' : 'End'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-spot to Cluster Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Admin Re-spot to Cluster</h3>
        <div>
          {activations.map((activation) => (
            <div key={activation.activationId} style={{ marginBottom: '1.5em', padding: '1em' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>{activation.callsign}</strong> @ {activation.frequencyMhz} MHz ({activation.mode})
                </div>
                <button
                  onClick={() => handleClusterSpot(activation)}
                  disabled={(spotCooldown[activation.activationId] ?? 0) > 0}
                  style={{ marginLeft: '1em', background: '#e3fcec', color: '#155724', border: '1px solid #b7eb8f', borderRadius: '6px', padding: '0.4em 1em', fontWeight: 'bold', cursor: (spotCooldown[activation.activationId] ?? 0) > 0 ? 'not-allowed' : 'pointer', opacity: (spotCooldown[activation.activationId] ?? 0) > 0 ? 0.6 : 1 }}
                  title={(spotCooldown[activation.activationId] ?? 0) > 0 ? `Please wait ${Math.ceil((spotCooldown[activation.activationId] ?? 0)/60)} min before re-spotting` : 'Re-Spot to Cluster'}
                >
                  📡 Re-Spot to Cluster
                </button>
              </div>
              <textarea
                value={spotComment[activation.activationId] || 'AMERICA250 SES'}
                onChange={e => setSpotComment(prev => ({ ...prev, [activation.activationId]: e.target.value }))}
                rows={2}
                style={{ width: '100%', marginTop: '0.5em', fontFamily: 'inherit', fontSize: '1em', borderRadius: '4px', border: '1px solid #ccc', padding: '0.5em', background: 'var(--parchment)' }}
                placeholder="Edit spot comment before sending..."
              />
              {spotStatus[activation.activationId] && (
                <div style={{ marginTop: '0.5em', color: (spotStatus[activation.activationId] ?? '').startsWith('✅') ? '#155724' : '#b94a48', fontWeight: 'bold' }}>
                  {spotStatus[activation.activationId]}
                </div>
              )}
              {spotResponse[activation.activationId] && (
                <pre style={{ marginTop: '0.5em', background: '#f6f8fa', color: '#333', borderRadius: '4px', padding: '0.5em', fontSize: '0.95em', overflowX: 'auto' }}>{spotResponse[activation.activationId]}</pre>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Activation Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Create Activation</h3>
        <div className={styles.pinCreateForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="volunteer-select">Volunteer:</label>
              <select
                id="volunteer-select"
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value ? Number(e.target.value) : '')}
                className={styles.formSelect}
              >
                <option value="">Select a volunteer...</option>
                {volunteers
                  .filter(v => v && v.volunteerId && v.name && v.callsign)
                  .map((volunteer) => (
                    <option key={volunteer.volunteerId} value={volunteer.volunteerId}>
                      {volunteer.callsign || 'No Callsign'} - {volunteer.name || 'No Name'} ({volunteer.state || 'No State'})
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="frequency-input">Frequency (MHz):</label>
              <input
                id="frequency-input"
                name="frequency-input"
                type="text"
                value={activationFrequency}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className={styles.formInput}
                placeholder="e.g., 7074 or 7.074"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="mode-select">Mode:</label>
              <select
                id="mode-select"
                value={activationMode}
                onChange={(e) => setActivationMode(e.target.value)}
                className={styles.formSelect}
              >
                <option value="">Select mode...</option>
                <option value="SSB">SSB</option>
                <option value="CW">CW</option>
                <option value="FT8">FT8</option>
                <option value="FT4">FT4</option>
                <option value="PSK31">PSK31</option>
                <option value="Olivia">Olivia</option>
                <option value="FM">FM</option>
                <option value="AM">AM</option>
                <option value="EchoLink">EchoLink</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>&nbsp;</label>
              <button
                onClick={handleCreateActivation}
                disabled={isCreatingActivation}
                className="btn btn-primary"
              >
                {isCreatingActivation ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
                    Creating...
                  </>
                ) : 'Create Activation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Management Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Volunteer Management</h3>
        <VolunteerManagement onVolunteersChange={fetchVolunteers} isAdmin={true} />
      </div>

      {/* ADI Submissions Table Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>ADI Submissions</h3>
        
        {/* Search and Sort Controls */}
        <div className={styles.submissionControls}>
          <div className={styles.searchBox}>
            <label htmlFor="submission-search" className="sr-only">Search submissions</label>
            <input
              id="submission-search"
              name="submission-search"
              type="text"
              placeholder="Search submissions..."
              value={submissionSearch}
              onChange={(e) => setSubmissionSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.sortControls}>
            <label htmlFor="submission-sort" className="sr-only">Sort submissions by</label>
            <select
              id="submission-sort"
              name="submission-sort"
              value={submissionSortBy}
              onChange={(e) => setSubmissionSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="submittedAt">Date/Time</option>
              <option value="volunteerName">Volunteer Name</option>
              <option value="volunteerCallsign">Callsign</option>
              <option value="filename">Filename</option>
              <option value="recordCount">Record Count</option>
              <option value="processedCount">Processed Count</option>
              <option value="status">Status</option>
            </select>
            
            <button
              onClick={() => setSubmissionSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className={styles.sortButton}
            >
              {submissionSortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className={styles.submissionsTableWrapper}>
          <table className={styles.submissionsTable}>
            <thead>
              <tr>
                <th 
                  className={styles.sortableHeader}
                >
                  Date/Time
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Name
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Callsign
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Filename
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Records
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Proc&apos;d
                </th>
                <th 
                  className={styles.sortableHeader}
                >
                  Status
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adiSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <div>{new Date(submission.submittedAt).toLocaleDateString()}</div>
                    <div style={{fontSize: '0.85em'}}>{new Date(submission.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td>{submission.volunteerName}</td>
                  <td>{submission.volunteerCallsign}</td>
                  <td>{submission.filename}</td>
                  <td>{submission.recordCount}</td>
                  <td>{submission.processedCount}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[submission.status]}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className={styles.viewBtn}
                      title="View ADI Content"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      disabled={isDeletingSubmission === submission.id}
                      className={styles.deleteBtn}
                      title="Delete Submission"
                    >
                      {isDeletingSubmission === submission.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout for ADI Submissions */}
        <div className={styles.submissionsCard}>
          {adiSubmissions.map((submission) => (
            <div key={submission.id} className={styles.submissionCard}>
              <div className={styles.submissionCardHeader}>
                <h4 className={styles.submissionCardTitle}>
                  {submission.filename}
                </h4>
                <div className={styles.submissionCardStatus}>
                  <span className={`${styles.statusBadge} ${styles[submission.status]}`}>
                    {submission.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.submissionCardDetails}>
                <div className={styles.submissionCardDetail}>
                  <span className={styles.submissionCardLabel}>Date/Time</span>
                  <span className={styles.submissionCardValue}>
                    {new Date(submission.submittedAt).toLocaleDateString()} {new Date(submission.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className={styles.submissionCardDetail}>
                  <span className={styles.submissionCardLabel}>Volunteer</span>
                  <span className={styles.submissionCardValue}>
                    {submission.volunteerName}
                  </span>
                </div>
                <div className={styles.submissionCardDetail}>
                  <span className={styles.submissionCardLabel}>Callsign</span>
                  <span className={styles.submissionCardValue}>
                    {submission.volunteerCallsign}
                  </span>
                </div>
                <div className={styles.submissionCardDetail}>
                  <span className={styles.submissionCardLabel}>Records</span>
                  <span className={styles.submissionCardValue}>
                    {submission.recordCount}
                  </span>
                </div>
                <div className={styles.submissionCardDetail}>
                  <span className={styles.submissionCardLabel}>Processed</span>
                  <span className={styles.submissionCardValue}>
                    {submission.processedCount}
                  </span>
                </div>
              </div>
              
              <div className={styles.submissionCardActions}>
                <button
                  onClick={() => setSelectedSubmission(submission)}
                  className={styles.viewBtn}
                  title="View ADI Content"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteSubmission(submission.id)}
                  disabled={isDeletingSubmission === submission.id}
                  className={styles.deleteBtn}
                  title="Delete Submission"
                >
                  {isDeletingSubmission === submission.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADI Content Modal */}
        {selectedSubmission && (
          <div className={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>ADI File Content - {selectedSubmission.filename}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSubmission.fileContent);
                      setSuccessMessage('ADI content copied to clipboard!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                    title="Copy ADI content to clipboard"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className={styles.closeButton}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.modalBody}>
                <textarea
                  value={selectedSubmission.fileContent}
                  readOnly
                  className={styles.adiContent}
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    resize: 'vertical',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '1rem',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    userSelect: 'text',
                    cursor: 'text'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 