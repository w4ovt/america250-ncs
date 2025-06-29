'use client';

import { useState, useEffect } from 'react';
import styles from './ActivationTableQRZ.module.css';

interface ApiActivation {
  activationId: number;
  frequencyMhz: string;
  mode: string;
  startedAt: string;
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
}

interface Activation {
  id: string;
  volunteerName: string;
  volunteerCallsign: string;
  frequency: string;
  mode: string;
  state: string;
  startTime: string;
  endTime: string | null;
  status: 'active' | 'ended';
}

export default function ActivationTableQRZ() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchActivations = async () => {
    try {
      const response = await fetch('/api/activations/list');
      if (response.ok) {
        const data: ApiActivation[] = await response.json();
        
        // Transform API data to component format
        const transformedActivations: Activation[] = data.map(activation => ({
          id: activation.activationId.toString(),
          volunteerName: activation.name,
          volunteerCallsign: activation.callsign,
          frequency: activation.frequencyMhz,
          mode: activation.mode,
          state: activation.state,
          startTime: activation.startedAt,
          endTime: null, // API doesn't provide endTime yet
          status: 'active' as const // Assume active since no endTime
        }));
        
        setActivations(transformedActivations);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to fetch activations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivations();
    const interval = setInterval(fetchActivations, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={styles.qrzContainer}>
        <div className={styles.qrzLoading}>Loading activations...</div>
      </div>
    );
  }

  return (
    <div className={styles.qrzContainer}>
      {/* Desktop Table View */}
      <table className={styles.qrzTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Volunteer</th>
            <th>Freq</th>
            <th>Mode</th>
            <th>State</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activations.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                No active activations
              </td>
            </tr>
          ) : (
            activations.map((activation) => (
              <tr key={activation.id}>
                <td>{formatDate(activation.startTime)}</td>
                <td>{formatTime(activation.startTime)}</td>
                <td>
                  <strong>{activation.volunteerCallsign}</strong>
                  <br />
                  <span style={{ fontSize: '8px', color: '#666' }}>
                    {activation.volunteerName}
                  </span>
                </td>
                <td>
                  <strong>{activation.frequency}</strong>
                </td>
                <td>
                  <span className={styles.qrzCardMode}>{activation.mode}</span>
                </td>
                <td>{activation.state}</td>
                <td>
                  <span style={{ 
                    color: activation.status === 'active' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold',
                    fontSize: '9px'
                  }}>
                    {activation.status === 'active' ? 'ACTIVE' : 'ENDED'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className={styles.qrzCardContainer}>
        {activations.length === 0 ? (
          <div className={styles.qrzCard}>
            <div className={styles.qrzCardEmpty}>No active activations</div>
          </div>
        ) : (
          activations.map((activation) => (
            <div key={activation.id} className={styles.qrzCard}>
              <div className={styles.qrzCardHeader}>
                {formatDate(activation.startTime)} at {formatTime(activation.startTime)}
              </div>
              <div className={styles.qrzCardDetails}>
                <span className={styles.qrzCardCallsign}>{activation.volunteerCallsign}</span>
                <span className={styles.qrzCardState}>{activation.state}</span>
                <br />
                {activation.volunteerName}
                <br />
                <span className={styles.qrzCardFrequency}>{activation.frequency}</span>
                <span className={styles.qrzCardMode}>{activation.mode}</span>
                <br />
                <span style={{ 
                  color: activation.status === 'active' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                  fontSize: '8px'
                }}>
                  {activation.status === 'active' ? 'ACTIVE' : 'ENDED'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.qrzUpdated}>
        Last updated: {lastUpdated}
      </div>
    </div>
  );
} 