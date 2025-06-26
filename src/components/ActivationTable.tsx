'use client';

import { useEffect, useState } from 'react';

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

  if (isLoading) {
    return (
      <div className="activations-table-wrapper">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading activations...
        </div>
      </div>
    );
  }

  return (
    <div className="activations-table-wrapper">
      <table className="activations-table">
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
    </div>
  );
} 