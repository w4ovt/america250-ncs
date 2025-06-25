'use client';

import { useState, useEffect } from 'react';
import GuideButton from '../GuideButton';
import AdminDashboard from '../../components/AdminDashboard';

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

export default function VolunteerPage() {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [volunteerData, setVolunteerData] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [currentActivationId, setCurrentActivationId] = useState<number | null>(null);
  const [activationForm, setActivationForm] = useState<ActivationForm>({
    frequency: '',
    mode: ''
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const stored = localStorage.getItem('volunteerAuth');
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        setVolunteerData(authData);
      } catch {
        localStorage.removeItem('volunteerAuth');
      }
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= 3) {
      setErrorMessage('Contact Marc-W4OVT for Assistance');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        setVolunteerData(data);
        localStorage.setItem('volunteerAuth', JSON.stringify(data));
        setPin('');
        setAttempts(0);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Authentication failed');
        setAttempts(prev => prev + 1);
        setPin('');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
      setAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('volunteerAuth');
    setVolunteerData(null);
    setAttempts(0);
    setErrorMessage('');
    setPin('');
    setCurrentActivationId(null);
    setIsActivating(false);
    setIsEnding(false);
  };

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!volunteerData?.volunteer) {
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
    if (!currentActivationId) {
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

  const isAuthenticated = !!volunteerData;
  const isAdmin = volunteerData?.role === 'admin';

  return (
    <main className="volunteer-page">
      {/* K4A NCS Guide Button - Always Visible */}
      <div className="guide-section">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <GuideButton />
        </div>
      </div>

      {/* PIN Authentication Section - Always Visible */}
      <div className="pin-auth-section">
        <div className="auth-container">
          <h1 className="auth-title">Volunteer Access</h1>
          <p className="auth-subtitle">Enter your 4-digit PIN to continue</p>
          
          <form onSubmit={handlePinSubmit} className="pin-form">
            <div className="pin-input-group">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="pin-input"
                placeholder="0000"
                maxLength={4}
                pattern="\d{4}"
                required
                disabled={attempts >= 3}
              />
            </div>
            
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
            
            {attempts > 0 && attempts < 3 && (
              <div className="attempts-warning">
                {3 - attempts} attempts remaining
              </div>
            )}
            
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || attempts >= 3 || pin.length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* Volunteer Dashboard - Always Visible, Functionality Gated */}
      <div className="volunteer-dashboard-section">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Volunteer Dashboard</h1>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">
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
                  disabled={isEnding}
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
                      className="form-input"
                      placeholder="e.g., 7.074"
                      value={activationForm.frequency}
                      onChange={(e) => setActivationForm(prev => ({ ...prev, frequency: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="mode">Mode</label>
                    <select 
                      id="mode" 
                      className="form-select"
                      value={activationForm.mode}
                      onChange={(e) => setActivationForm(prev => ({ ...prev, mode: e.target.value }))}
                      required
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
                    className="start-btn"
                    disabled={isActivating || !activationForm.frequency || !activationForm.mode}
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

      {/* ADI Dropbox Block - Always Visible, Upload Gated */}
      <div className="adi-section">
        <h2 className="section-title">ADI File Upload</h2>
        <div className="adi-upload-area">
          <p>Upload your ADI logbook file to submit QSO records to QRZ.</p>
          <input
            type="file"
            accept=".adi,.ADI"
            className={`file-input ${!isAuthenticated ? 'disabled' : ''}`}
            disabled={!isAuthenticated}
          />
          <button 
            className={`upload-btn ${!isAuthenticated ? 'disabled' : ''}`}
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? 'Upload ADI File' : 'Upload ADI File'}
          </button>
          {!isAuthenticated && (
            <div className="auth-notice">
              <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Dashboard - Always Visible, Functionality Gated */}
      <div className="admin-section">
        <h2 className="section-title">Admin Tools</h2>
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="admin-placeholder">
            <div className="placeholder-content">
              <h3 className="form-title">PIN Management</h3>
              <p>Admin tools for managing PINs and system configuration.</p>
              <div className="placeholder-form">
                <div className="form-group">
                  <label>Role</label>
                  <select className="form-select disabled" disabled>
                    <option>Volunteer</option>
                    <option>Admin</option>
                  </select>
                </div>
                <button className="create-btn disabled" disabled>
                  Generate PIN
                </button>
              </div>
              <div className="placeholder-table">
                <table className="pins-table">
                  <thead>
                    <tr>
                      <th>PIN</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>7317</td>
                      <td>Admin</td>
                      <td><span className="reserved-badge">Reserved</span></td>
                    </tr>
                    <tr>
                      <td>7373</td>
                      <td>Admin</td>
                      <td><span className="reserved-badge">Reserved</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="auth-notice">
                <p>This feature is interactive for authenticated volunteers or admins. Enter PIN above to activate.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 