'use client';

import { useState, useEffect } from 'react';

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

  const handleEndActivation = () => {
    setCurrentActivationId(null);
    setErrorMessage('');
  };

  // If authenticated, show volunteer form
  if (volunteerData) {
    return (
      <main className="volunteer-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Volunteer Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        
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
            <button onClick={handleEndActivation} className="end-btn">
              End Activation
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
      </main>
    );
  }

  // Show PIN input form
  return (
    <main className="pin-auth">
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
    </main>
  );
} 