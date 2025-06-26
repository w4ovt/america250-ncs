'use client';

import { useState, useEffect } from 'react';

interface Pin {
  pinId: number;
  pin: string;
  role: string;
}

export default function AdminDashboard() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const RESERVED_PINS = ['7317', '7373'];

  const fetchPins = async () => {
    try {
      const response = await fetch('/api/admin/pins');
      if (response.ok) {
        const data = await response.json();
        setPins(data);
      } else {
        setErrorMessage('Failed to load PINs');
      }
    } catch {
      setErrorMessage('Network error loading PINs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(fetchPins, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCreatePin = async () => {
    setIsCreating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`PIN ${data.pin} created successfully for ${selectedRole} role`);
        fetchPins(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create PIN');
      }
    } catch {
      setErrorMessage('Network error creating PIN');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePin = async (pinId: number, pin: string) => {
    if (RESERVED_PINS.includes(pin)) {
      setErrorMessage(`Cannot delete reserved PIN ${pin}`);
      return;
    }

    setIsDeleting(pinId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/admin/pins/${pinId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(`PIN ${pin} deleted successfully`);
        fetchPins(); // Refresh the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete PIN');
      }
    } catch {
      setErrorMessage('Network error deleting PIN');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">PIN Management</h2>
      
      {/* Create PIN Form */}
      <div className="pin-create-form">
        <h3 className="form-title">Create New PIN</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role-select">Role</label>
            <select
              id="role-select"
              name="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
            >
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={handleCreatePin}
            className="create-btn"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Generate PIN'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* PINs Table */}
      <div className="pins-table-wrapper">
        <h3 className="form-title">Current PINs</h3>
        <table className="pins-table">
          <thead>
            <tr>
              <th>PIN</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pins.map((pin) => (
              <tr key={pin.pinId}>
                <td>{pin.pin}</td>
                <td>{pin.role}</td>
                <td>
                  {RESERVED_PINS.includes(pin.pin) ? (
                    <span className="reserved-badge">Reserved</span>
                  ) : (
                    <button
                      onClick={() => handleDeletePin(pin.pinId, pin.pin)}
                      className="delete-btn"
                      disabled={isDeleting === pin.pinId}
                    >
                      {isDeleting === pin.pinId ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 