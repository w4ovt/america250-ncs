'use client';

import { useEffect, useState } from 'react';
import styles from './ActivationTableIframe.module.css';

interface Activation {
  activationId: number;
  frequencyMhz: string | number;
  mode: string;
  startedAt: string;
  name: string;
  callsign: string;
  state: string;
}

export default function ActivationTableIframe() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchActivations = async () => {
    try {
      const response = await fetch('/api/activations/list');
      if (response.ok) {
        const data = await response.json();
        setActivations(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch activations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivations();
    
    // Set up real-time updates every 30 seconds for iframe
    const interval = setInterval(fetchActivations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Always show minimum 3 rows for iframe
  const displayRows = Math.max(3, activations.length);
  const rows = Array.from({ length: displayRows }, (_, index) => {
    const activation = activations[index];
    return activation ? (
      <tr key={activation.activationId}>
        <td>{new Date(activation.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
        <td>{new Date(activation.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>{activation.name} <span style={{ color: '#888', fontSize: '0.95em' }}>{activation.callsign}</span></td>
        <td>{activation.state}</td>
        <td>{activation.mode}</td>
        <td style={{ textAlign: 'center', color: '#28a745', fontWeight: 'bold', fontSize: '0.95em' }}>ON</td>
      </tr>
    ) : (
      <tr key={`empty-${index}`}>
        <td>—</td>
        <td>—</td>
        <td>—</td>
        <td>—</td>
        <td>—</td>
        <td>—</td>
      </tr>
    );
  });

  // Create compact cards for mobile iframe
  const cards = Array.from({ length: displayRows }, (_, index) => {
    const activation = activations[index];
    return activation ? (
      <div key={activation.activationId} className={styles.activationCard}>
        <div className={styles.activationCardHeader}>
          <span className={styles.activationCardDate}>
            {new Date(activation.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
          <span className={styles.activationCardTime}>
            {new Date(activation.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={styles.activationCardDetails}>
          <span className={styles.activationCardNameCallsign}>
            {activation.name} <span style={{ color: '#888', fontSize: '0.95em' }}>{activation.callsign}</span>
          </span>
          <span className={styles.activationCardState}>{activation.state}</span>
          <span className={styles.activationCardMode}>{activation.mode}</span>
          <span className={styles.activationCardOnAir} style={{ color: '#28a745', fontWeight: 'bold', fontSize: '0.95em' }}>ON</span>
        </div>
      </div>
    ) : (
      <div key={`empty-${index}`} className={styles.activationCard}>
        <div className={styles.activationCardHeader}>
          <span className={styles.activationCardEmpty}>No Activation</span>
        </div>
      </div>
    );
  });

  if (isLoading) {
    return (
      <div className={styles.iframeContainer}>
        <div className={styles.loadingMessage}>
          Loading activations...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.iframeContainer}>
      {/* Desktop/Tablet Table Layout */}
      <table className={styles.activationsTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Name/Callsign</th>
            <th>State</th>
            <th>Mode</th>
            <th style={{ minWidth: '48px' }}>ON AIR</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className={styles.activationsCard}>
        {cards}
      </div>

      {/* Last Updated Footer */}
      <div className={styles.lastUpdated}>
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
} 