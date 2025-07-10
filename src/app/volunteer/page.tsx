'use client';

import { useState, useEffect } from 'react';
import GuideButton from '../GuideButton';
import VolunteerDashboard from '../../components/VolunteerDashboard';
import K4ADropzone from '../../components/K4ADropzone';
import AdminDashboard from '../../components/AdminDashboard';
import Navigation from '../../components/Navigation';
import styles from './page.module.css';

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
        // Set volunteerAuth as a cookie for backend admin checks
        document.cookie = `volunteerAuth=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=86400; SameSite=Lax`;
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
    // Clear authentication data
    localStorage.removeItem('volunteerAuth');
    
    // Clear the cookie as well
    document.cookie = 'volunteerAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear activation state for this volunteer
    if (volunteerData?.volunteer) {
      localStorage.removeItem(`activation_${volunteerData.volunteer.volunteerId}`);
    }
    
    setVolunteerData(null);
    setAttempts(0);
    setErrorMessage('');
    setPin('');
  };

  const isAuthenticated = !!volunteerData;
  const isAdmin = volunteerData?.role === 'admin';

  return (
    <>
      <Navigation />
      <main className={styles.volunteerPage} style={{ marginTop: '2rem' }}>
      {/* K4A NCS Guide Section */}
      <div className={styles.guideSection} style={{ paddingTop: '50px' }}>
        <GuideButton />
      </div>

      {/* PIN Authentication Section */}
      <div className={styles.pinAuthSection}>
        <h1 className={styles.authTitle}>Volunteer Access</h1>
        <p className={styles.authSubtitle}>Enter your 4-digit PIN to continue</p>
        
        <form onSubmit={handlePinSubmit} className={styles.pinForm}>
          <div className={styles.pinInputGroup}>
            <label htmlFor="pin-input" className="sr-only">PIN</label>
            <div className={styles.pinBoxes}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={styles.pinDigitBox}
                  tabIndex={i === 0 ? 0 : -1}
                  aria-label={`PIN digit ${i + 1}`}
                  onClick={() => document.getElementById('pin-hidden-input')?.focus()}
                >
                  {pin[i] ? pin[i] : '_'}
                </div>
              ))}
              <input
                type="password"
                id="pin-hidden-input"
                name="pin-input"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                pattern="\d{4}"
                required
                disabled={attempts >= 3}
                autoComplete="off"
                className={styles.pinHiddenInput}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                tabIndex={-1}
              />
            </div>
          </div>
          
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          
          {attempts > 0 && attempts < 3 && (
            <div className={styles.attemptsWarning}>
              {3 - attempts} attempts remaining
            </div>
          )}
          
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || attempts >= 3 || pin.length !== 4}
          >
            {isLoading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Volunteer Dashboard Section */}
      <div className={styles.volunteerDashboardSection}>
        <VolunteerDashboard 
          disabled={!isAuthenticated}
          volunteerData={volunteerData}
          onLogout={handleLogout}
        />
      </div>

      {/* K4A Log Dropbox Section */}
      <div className={styles.k4aDropzoneSection}>
        <K4ADropzone disabled={!isAuthenticated} volunteerData={volunteerData} />
      </div>

      {/* Admin Dashboard Section */}
      {isAdmin && (
        <div className={styles.adminSection}>
          <AdminDashboard onLogout={handleLogout} />
        </div>
      )}
    </main>
    </>
  );
} 