'use client';

import { useState, useEffect } from 'react';
import GuideButton from '../GuideButton';
import VolunteerDashboard from '../../components/VolunteerDashboard';
import K4ADropzone from '../../components/K4ADropzone';
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

export default function VolunteerPage() {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [volunteerData, setVolunteerData] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const isAuthenticated = !!volunteerData;
  const isAdmin = volunteerData?.role === 'admin';

  return (
    <main className="volunteer-page">
      {/* K4A NCS Guide Button - Always Visible */}
      <GuideButton />

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
      <VolunteerDashboard 
        disabled={!isAuthenticated}
        volunteerData={volunteerData}
        onLogout={handleLogout}
      />

      {/* K4A Log Dropbox - Always Visible, Upload Gated */}
      <K4ADropzone disabled={!isAuthenticated} volunteerData={volunteerData} />

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