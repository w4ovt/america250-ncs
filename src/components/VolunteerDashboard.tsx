'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VolunteerDashboard.module.css';

interface VolunteerData {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
}

interface AuthResponse {
  pinId: number;
  role: 'admin' | 'volunteer';
  volunteer: VolunteerData | null;
}

interface ActivationForm {
  frequency: string;
  mode: string;
}

interface VolunteerDashboardProps {
  disabled?: boolean;
  volunteerData?: AuthResponse | null;
  onLogout?: () => void;
}

export default function VolunteerDashboard({ disabled = false, volunteerData, onLogout }: VolunteerDashboardProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [currentActivationId, setCurrentActivationId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activationForm, setActivationForm] = useState<ActivationForm>({
    frequency: '',
    mode: ''
  });
  const [multiTabWarning, setMultiTabWarning] = useState(false);

  const isAuthenticated = !!volunteerData;
  const logoutRef = useRef<HTMLAnchorElement>(null);

  // Load persistent activation state on mount
  useEffect(() => {
    if (isAuthenticated && volunteerData?.volunteer) {
      const stored = localStorage.getItem(`activation_${volunteerData.volunteer.volunteerId}`);
      if (stored) {
        try {
          const activationData = JSON.parse(stored);
          setCurrentActivationId(activationData.activationId);
        } catch {
          localStorage.removeItem(`activation_${volunteerData.volunteer.volunteerId}`);
        }
      }
    }
  }, [isAuthenticated, volunteerData]);

  // Save activation state to localStorage
  const saveActivationState = (activationId: number | null) => {
    if (volunteerData?.volunteer) {
      if (activationId) {
        localStorage.setItem(`activation_${volunteerData.volunteer.volunteerId}`, JSON.stringify({ activationId }));
      } else {
        localStorage.removeItem(`activation_${volunteerData.volunteer.volunteerId}`);
      }
    }
  };

  const handleFrequencyChange = (value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // If the value is empty, just set it
    if (!cleanValue) {
      setActivationForm(prev => ({ ...prev, frequency: '' }));
      return;
    }
    
    // If it's already a decimal number (like 7.074), keep it as is
    if (cleanValue.includes('.')) {
      setActivationForm(prev => ({ ...prev, frequency: cleanValue }));
      return;
    }
    
    // If it's a whole number, assume it's kHz and convert to MHz
    const numValue = parseInt(cleanValue, 10);
    if (numValue >= 1800 && numValue <= 148000) { // Valid kHz range (1.8-148 MHz)
      const mhzValue = (numValue / 1000).toFixed(3);
      setActivationForm(prev => ({ ...prev, frequency: mhzValue }));
    } else {
      // If it's not in valid range, just set the raw value
      setActivationForm(prev => ({ ...prev, frequency: cleanValue }));
    }
  };

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!volunteerData?.volunteer || disabled) {
      setErrorMessage('Volunteer data not available');
      return;
    }

    setIsActivating(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/activations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteerId: volunteerData.volunteer.volunteerId,
          frequencyMhz: parseFloat(activationForm.frequency),
          mode: activationForm.mode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentActivationId(data.activationId);
        saveActivationState(data.activationId);
        setActivationForm({ frequency: '', mode: '' });
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to start activation');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleEndActivation = async () => {
    if (!currentActivationId || disabled) {
      setErrorMessage('No active activation to end');
      return;
    }

    setIsEnding(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/activations/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activationId: currentActivationId }),
      });

      if (response.ok) {
        setCurrentActivationId(null);
        saveActivationState(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to end activation');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsEnding(false);
    }
  };

  // Handler for logout attempt when activation is live
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (currentActivationId) {
      e.preventDefault();
      alert('Please end your activation before logging out.');
    } else {
      if (onLogout) {
        onLogout();
      }
    }
  };

  useEffect(() => {
    // Set a flag in localStorage when this dashboard is loaded
    localStorage.setItem('volunteer_dashboard_active', 'true');
    // Listen for changes in localStorage from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'volunteer_dashboard_active' && e.newValue === 'true') {
        setMultiTabWarning(true);
      }
    };
    window.addEventListener('storage', handleStorage);
    // On unmount, clear the flag
    return () => {
      localStorage.removeItem('volunteer_dashboard_active');
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className={styles.volunteerDashboardSection}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Volunteer Dashboard</h1>
      </div>
      
      {/* Multi-tab warning pop-up */}
      {multiTabWarning && (
        <div style={{
          position: 'fixed',
          top: '120px',
          right: '40px',
          zIndex: 1000,
          background: '#fffbe6',
          border: '2px solid #b8860b',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(104,63,27,0.18)',
          padding: '2rem 2.5rem',
          color: '#6b3e1d',
          fontWeight: 'bold',
          fontSize: '1.15rem',
          maxWidth: '340px',
          minWidth: '220px',
          textAlign: 'center',
          animation: 'pulse-olive 2s infinite',
        }}>
          <span role="img" aria-label="warning" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>⚠️</span>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Heads up!</strong> You have the Volunteer Dashboard open in another tab or window.<br /><br />
            Please use only <u>one session at a time</u> to avoid issues with activations.<br /><br />
            (If you&rsquo;re testing, you&rsquo;re forgiven. If you&rsquo;re a volunteer, behave! ��)
          </div>
        </div>
      )}

      {isAuthenticated ? (
        <>
          <div className={styles.volunteerInfo}>
            <h2 className={styles.welcomeText}>
              Welcome, {volunteerData.volunteer?.name || 'Volunteer'}
            </h2>
            {volunteerData.volunteer && (
              <div className={styles.volunteerDetails}>
                <p><strong>Callsign:</strong> {volunteerData.volunteer.callsign}</p>
                <p><strong>State:</strong> {volunteerData.volunteer.state}</p>
                <p><strong>Role:</strong> {volunteerData.role}</p>
              </div>
            )}
            
            <a
              href="#"
              ref={logoutRef}
              onClick={handleLogout}
              style={{
                color: currentActivationId ? '#aaa' : '#6b3e1d',
                pointerEvents: currentActivationId ? 'none' : 'auto',
                cursor: currentActivationId ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                fontWeight: 'bold',
                marginTop: '1em',
                fontSize: '1.1em',
                opacity: currentActivationId ? 0.5 : 1
              }}
            >
              Logout
            </a>
          </div>

          {currentActivationId ? (
            <div className={styles.activationActive}>
              <h3 className={styles.formTitle}>Activation Active</h3>
              <p>Your activation (ID: {currentActivationId}) is now live and visible on the homepage.</p>
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* SVG Halo Glow */}
                <svg
                  width="160" height="60"
                  style={{
                    position: 'absolute',
                    top: '-20px', left: '-20px',
                    pointerEvents: 'none',
                    zIndex: 0,
                    filter: 'blur(2px)'
                  }}
                >
                  <ellipse
                    cx="80" cy="30" rx="60" ry="20"
                    fill="url(#mahogany-glow)"
                    opacity="0.7"
                  />
                  <defs>
                    <radialGradient id="mahogany-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6b3e1d" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#6b3e1d" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
                <button
                  onClick={handleEndActivation}
                  className="btn btn-danger end-activation-pulse"
                  disabled={isEnding || disabled}
                  style={{
                    boxShadow: '0 0 0 4px #6b3e1d',
                    border: '2.5px solid #D4AF37', // burnished brass
                    animation: 'pulse-mahogany 2s infinite',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    marginTop: '1.5em',
                    transition: 'box-shadow 0.3s, border 0.3s',
                    position: 'relative',
                    zIndex: 1,
                    background: '#fffbe6',
                    color: '#6b3e1d',
                  }}
                >
                  {isEnding ? (
                    <>
                      <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
                      Ending...
                    </>
                  ) : 'End Activation'}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.activationForm}>
              <h3 className={styles.formTitle}>Start Activation</h3>
              <form onSubmit={handleActivationSubmit} className={styles.activationFormContent}>
                <div className={styles.formGroup}>
                  <label htmlFor="frequency">Frequency (MHz)</label>
                  <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    className={styles.formInput + (disabled ? ' disabled' : '')}
                    placeholder="e.g., 7074 or 7.074"
                    value={activationForm.frequency}
                    onChange={(e) => handleFrequencyChange(e.target.value)}
                    required
                    disabled={disabled}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="mode">Mode</label>
                  <select 
                    id="mode"
                    name="mode"
                    className={styles.formSelect + (disabled ? ' disabled' : '')}
                    value={activationForm.mode}
                    onChange={(e) => setActivationForm(prev => ({ ...prev, mode: e.target.value }))}
                    required
                    disabled={disabled}
                  >
                    <option value="">Select Mode</option>
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

                {errorMessage && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  className={'btn btn-primary' + (disabled ? ' disabled' : '')}
                  disabled={isActivating || !activationForm.frequency || !activationForm.mode || disabled}
                >
                  {isActivating ? 'Starting...' : 'Start Activation'}
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className={styles.dashboardPlaceholder}>
          <div className={styles.placeholderContent}>
            <h3 className={styles.formTitle}>Volunteer Dashboard</h3>
            <p>This dashboard allows volunteers to start and manage activations.</p>
            <div className={styles.placeholderForm}>
              <div className={styles.formGroup}>
                <label htmlFor="placeholder-frequency">Frequency (MHz)</label>
                <input
                  type="text"
                  id="placeholder-frequency"
                  name="placeholder-frequency"
                  className={styles.formInput + ' disabled'}
                  placeholder="e.g., 7074 or 7.074"
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="placeholder-mode">Mode</label>
                <select id="placeholder-mode" name="placeholder-mode" className={styles.formSelect + ' disabled'} disabled>
                  <option>Select Mode</option>
                </select>
              </div>
              <button className={styles.startBtn + ' disabled'} disabled>
                Start Activation
              </button>
            </div>
            <div className={styles.authNotice}>
              <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Add this to the bottom of the file or in your global CSS */
/*
@keyframes pulse-olive {
  0% { box-shadow: 0 0 0 4px olive; }
  50% { box-shadow: 0 0 0 12px #80800044; }
  100% { box-shadow: 0 0 0 4px olive; }
}
*/ 