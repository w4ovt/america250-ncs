'use client';

import { useState, useEffect } from 'react';

interface ArchivedActivation {
  activationId: number;
  frequencyMhz: number;
  mode: string;
  name: string;
  callsign: string;
  state: string;
  startedAt: string;
  endedAt: string;
}

interface ActivationArchiveTableProps {
  isAdmin?: boolean;
}

type SortField = 'activationId' | 'frequencyMhz' | 'mode' | 'name' | 'callsign' | 'state' | 'startedAt' | 'endedAt';
type SortDirection = 'asc' | 'desc';

export default function ActivationArchiveTable({ isAdmin = false }: ActivationArchiveTableProps) {
  const [archivedActivations, setArchivedActivations] = useState<ArchivedActivation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('endedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchArchivedActivations = async () => {
    try {
      const response = await fetch('/api/activations/archive');
      if (response.ok) {
        const data = await response.json();
        setArchivedActivations(data);
      }
    } catch (error) {
      console.error('Failed to fetch archived activations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedActivations();
  }, []);

  const handleSort = (field: SortField) => {
    if (!isAdmin) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        timeZone: 'UTC',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' UTC'
    };
  };

  const sortedArchivedActivations = [...archivedActivations].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    if (!isAdmin) {
      return <th>{children}</th>;
    }
    
    return (
      <th 
        className="sortable-header"
        onClick={() => handleSort(field)}
      >
        {children}
        {sortField === field && (
          <span className="sort-indicator">
            {sortDirection === 'asc' ? ' ↑' : ' ↓'}
          </span>
        )}
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="archive-section">
        <h2 className="archive-title">Activation Archive</h2>
        <p className="archive-description">All ended activations from the America250 NCS event.</p>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading archive...
        </div>
      </div>
    );
  }

  return (
    <div className="archive-section">
      <h2 className="archive-title">Activation Archive</h2>
      <p className="archive-description">All ended activations from the America250 NCS event.</p>
      
      <div className="archive-table-wrapper">
        <table className="archive-table">
          <thead>
            <tr>
              <SortableHeader field="activationId">ID</SortableHeader>
              <SortableHeader field="frequencyMhz">Frequency</SortableHeader>
              <SortableHeader field="mode">Mode</SortableHeader>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="callsign">Callsign</SortableHeader>
              <SortableHeader field="state">State</SortableHeader>
              <SortableHeader field="startedAt">Started</SortableHeader>
              <SortableHeader field="endedAt">Ended</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedArchivedActivations.map((activation) => {
              const started = formatDateTime(activation.startedAt);
              const ended = formatDateTime(activation.endedAt);
              
              return (
                <tr key={activation.activationId}>
                  <td>{activation.activationId}</td>
                  <td>{activation.frequencyMhz.toFixed(3)}</td>
                  <td>{activation.mode}</td>
                  <td>{activation.name}</td>
                  <td>{activation.callsign}</td>
                  <td>{activation.state}</td>
                  <td>
                    <div>{started.date}</div>
                    <div className="time-utc">{started.time}</div>
                  </td>
                  <td>
                    <div>{ended.date}</div>
                    <div className="time-utc">{ended.time}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 