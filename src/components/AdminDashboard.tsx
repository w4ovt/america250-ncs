'use client';

import { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

interface Pin {
  pinId: number;
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

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isEndingActivation, setIsEndingActivation] = useState<number | null>(null);
  const [isResettingCounter, setIsResettingCounter] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [requestedPin, setRequestedPin] = useState('');

  const RESERVED_PINS = ['7317', '7373'];

  const fetchPins = async () => {
    try {
      const response = await fetch('/api/admin/pins');
      if (response.ok) {
        const data = await response.json();
        setPins(data);
      } else {
        setErrorMessage('Failed to load PINs');
      }
    } catch {
      setErrorMessage('Network error loading PINs');
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

  useEffect(() => {
    fetchPins();
    fetchActivations();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchPins();
      fetchActivations();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCreatePin = async () => {
    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole, pin: requestedPin || undefined }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`PIN ${data.pin} created successfully for ${selectedRole} role`);
        setRequestedPin('');
        fetchPins(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create PIN');
      }
    } catch {
      setErrorMessage('Network error creating PIN');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePin = async (pinId: number, pin: string) => {
    if (RESERVED_PINS.includes(pin)) {
      setErrorMessage(`Cannot delete reserved PIN ${pin}`);
      return;
    }

    setIsDeleting(pinId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/admin/pins/${pinId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(`PIN ${pin} deleted successfully`);
        fetchPins(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete PIN');
      }
    } catch {
      setErrorMessage('Network error deleting PIN');
    } finally {
      setIsDeleting(null);
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
        
        // If there are existing activations, ask user if they want to force delete them
        if (errorData.error === 'Cannot reset counter: activations exist') {
          const forceConfirm = confirm(
            `There are ${errorData.existingCount} existing activations. Do you want to DELETE ALL ACTIVATIONS and reset the counter? This action cannot be undone.`
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <h2 className={styles.adminTitle}>Admin Dashboard</h2>
      
      {onLogout && (
        <button 
          onClick={onLogout} 
          className={styles.logoutBtn}
          style={{ 
            display: 'block',
            marginTop: '1rem',
            marginBottom: '1rem',
            backgroundColor: 'var(--mahogany)',
            color: 'var(--parchment)',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1.5rem',
            fontFamily: 'librebaskerville-bold, serif',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      )}
      
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className={styles.successMessage} style={{ fontSize: '1.3rem', textAlign: 'center', margin: '1rem 0' }}>
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
            className={styles.createBtn + ' ' + styles.centeredBtn}
          >
            {isResettingCounter ? 'Resetting...' : 'Reset Activation Counter to 0'}
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
                      className={styles.endBtn}
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

      {/* Create PIN Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Create PIN</h3>
        <div className={styles.pinCreateForm + ' ' + styles.centeredBlock}>
          <div className={styles.formRow + ' ' + styles.centeredRow}>
            <div>
              <label htmlFor="role-select">Role:</label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={styles.formRow + ' ' + styles.formSelect}
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="requested-pin">Requested PIN (optional):</label>
              <input
                id="requested-pin"
                type="text"
                maxLength={4}
                pattern="[0-9]{4}"
                value={requestedPin}
                onChange={e => setRequestedPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={styles.formInput}
                placeholder="4 digits"
                autoComplete="off"
              />
            </div>
            <button
              onClick={handleCreatePin}
              disabled={isCreating}
              className={styles.createBtn + ' ' + styles.centeredBtn}
            >
              {isCreating ? 'Creating...' : 'Create PIN'}
            </button>
          </div>
        </div>
      </div>

      {/* PINs Table Section */}
      <div className={styles.adminSection}>
        <h3 className={styles.sectionTitle}>Manage PINs</h3>
        <div className={styles.pinsTableWrapper}>
          <table className={styles.pinsTable}>
            <thead>
              <tr>
                <th>PIN</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pins.map((pin) => (
                <tr key={pin.pinId}>
                  <td>
                    {pin.pin}
                    {RESERVED_PINS.includes(pin.pin) && (
                      <span className={styles.reservedBadge} style={{ marginLeft: '20px' }}>Reserved</span>
                    )}
                  </td>
                  <td>{pin.role}</td>
                  <td>
                    <button
                      onClick={() => handleDeletePin(pin.pinId, pin.pin)}
                      disabled={isDeleting === pin.pinId || RESERVED_PINS.includes(pin.pin)}
                      className={styles.deleteBtn}
                    >
                      {isDeleting === pin.pinId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 