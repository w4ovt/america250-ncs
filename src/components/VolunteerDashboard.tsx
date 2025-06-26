'use client';

import { useState } from 'react';

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

  const isAuthenticated = !!volunteerData;

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

  return (
    <div className="volunteer-dashboard-section">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Volunteer Dashboard</h1>
        {isAuthenticated && onLogout && (
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
      
      {isAuthenticated ? (
        <>
          <div className="volunteer-info">
            <h2 className="welcome-text">
              Welcome, {volunteerData.volunteer?.name || 'Volunteer'}
            </h2>
            {volunteerData.volunteer && (
              <div className="volunteer-details">
                <p><strong>Callsign:</strong> {volunteerData.volunteer.callsign}</p>
                <p><strong>State:</strong> {volunteerData.volunteer.state}</p>
                <p><strong>Role:</strong> {volunteerData.role}</p>
              </div>
            )}
          </div>

          {currentActivationId ? (
            <div className="activation-active">
              <h3 className="form-title">Activation Active</h3>
              <p>Your activation (ID: {currentActivationId}) is now live and visible on the homepage.</p>
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              <button 
                onClick={handleEndActivation} 
                className="end-btn"
                disabled={isEnding || disabled}
              >
                {isEnding ? 'Ending...' : 'End Activation'}
              </button>
            </div>
          ) : (
            <div className="activation-form">
              <h3 className="form-title">Start Activation</h3>
              <form onSubmit={handleActivationSubmit} className="activation-form-content">
                <div className="form-group">
                  <label htmlFor="frequency">Frequency (MHz)</label>
                  <input
                    type="number"
                    id="frequency"
                    step="0.001"
                    min="1.8"
                    max="148"
                    className={`form-input ${disabled ? 'disabled' : ''}`}
                    placeholder="e.g., 7.074"
                    value={activationForm.frequency}
                    onChange={(e) => setActivationForm(prev => ({ ...prev, frequency: e.target.value }))}
                    required
                    disabled={disabled}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="mode">Mode</label>
                  <select 
                    id="mode" 
                    className={`form-select ${disabled ? 'disabled' : ''}`}
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
                  className={`start-btn ${disabled ? 'disabled' : ''}`}
                  disabled={isActivating || !activationForm.frequency || !activationForm.mode || disabled}
                >
                  {isActivating ? 'Starting...' : 'Start Activation'}
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="dashboard-placeholder">
          <div className="placeholder-content">
            <h3 className="form-title">Volunteer Dashboard</h3>
            <p>This dashboard allows volunteers to start and manage activations.</p>
            <div className="placeholder-form">
              <div className="form-group">
                <label>Frequency (MHz)</label>
                <input
                  type="text"
                  className="form-input disabled"
                  placeholder="e.g., 7.074"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select className="form-select disabled" disabled>
                  <option>Select Mode</option>
                </select>
              </div>
              <button className="start-btn disabled" disabled>
                Start Activation
              </button>
            </div>
            <div className="auth-notice">
              <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 