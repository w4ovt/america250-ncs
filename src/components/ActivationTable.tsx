'use client';

import { useEffect, useState } from 'react';
import styles from './ActivationTable.module.css';

interface Activation {
  activationId: number;
  frequencyMhz: string | number;
  mode: string;
  startedAt: string;
  name: string;
  callsign: string;
  state: string;
}

export default function ActivationTable() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivations = async () => {
    try {
      const response = await fetch('/api/activations/list');
      if (response.ok) {
        const data = await response.json();
        setActivations(data);
      }
    } catch (error) {
      console.error('Failed to fetch activations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivations();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(fetchActivations, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Always show minimum 5 rows
  const displayRows = Math.max(5, activations.length);
  const rows = Array.from({ length: displayRows }, (_, index) => {
    const activation = activations[index];
    return activation ? (
      <tr key={activation.activationId}>
        <td>{activation.activationId}</td>
        <td>{Number(activation.frequencyMhz).toFixed(3)}</td>
        <td>{activation.mode}</td>
        <td>{activation.name}</td>
        <td>{activation.callsign}</td>
        <td>{activation.state}</td>
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

  // Create cards for mobile layout
  const cards = Array.from({ length: displayRows }, (_, index) => {
    const activation = activations[index];
    return activation ? (
      <div key={activation.activationId} className={styles.activationCard}>
        <div className={styles.activationCardHeader}>
          <h4 className={styles.activationCardTitle}>
            Activation #{activation.activationId}
          </h4>
          <div className={styles.activationCardStatus}>
            <span className={styles.statusBadge}>Active</span>
          </div>
        </div>
        
        <div className={styles.activationCardDetails}>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>Frequency</span>
            <span className={styles.activationCardValue}>
              {Number(activation.frequencyMhz).toFixed(3)} MHz
            </span>
          </div>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>Mode</span>
            <span className={styles.activationCardValue}>
              {activation.mode}
            </span>
          </div>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>Volunteer</span>
            <span className={styles.activationCardValue}>
              {activation.name}
            </span>
          </div>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>Callsign</span>
            <span className={styles.activationCardValue}>
              {activation.callsign}
            </span>
          </div>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>State</span>
            <span className={styles.activationCardValue}>
              {activation.state}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div key={`empty-${index}`} className={styles.activationCard}>
        <div className={styles.activationCardHeader}>
          <h4 className={styles.activationCardTitle}>No Activation</h4>
        </div>
        <div className={styles.activationCardDetails}>
          <div className={styles.activationCardDetail}>
            <span className={styles.activationCardLabel}>Status</span>
            <span className={styles.activationCardValue}>—</span>
          </div>
        </div>
      </div>
    );
  });

  if (isLoading) {
    return (
      <div className={styles.activationsTableWrapper}>
        <div className={styles.loadingMessage}>
          Loading activations...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activationsTableWrapper}>
      {/* Desktop/Tablet Table Layout */}
      <table className={styles.activationsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Frequency</th>
            <th>Mode</th>
            <th>Name</th>
            <th>Callsign</th>
            <th>State</th>
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
    </div>
  );
} 