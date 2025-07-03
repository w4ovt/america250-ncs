'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './VolunteerManagement.module.css';

interface Volunteer {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
  pin: string;
  role: string;
}

interface VolunteerManagementProps {
  onVolunteersChange?: () => void;
  isAdmin?: boolean;
}

export default function VolunteerManagement({ onVolunteersChange, isAdmin }: VolunteerManagementProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Volunteer>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    callsign: '',
    state: '',
    pin: '',
    role: 'volunteer'
  });

  const fetchVolunteers = useCallback(async () => {
    setError('');
    
    try {
      const response = await fetch('/api/admin/volunteers', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data);
      } else {
        setError('Failed to load volunteers');
      }
    } catch {
      setError('Network error loading volunteers');
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.callsign || !formData.state || !formData.pin) {
      setError('Please fill in all required fields');
      return;
    }

    // Check for duplicate PIN
    const existingVolunteer = volunteers.find(v => v.pin === formData.pin && v.volunteerId !== isEditing);
    if (existingVolunteer) {
      setError('PIN already exists. Please use a unique PIN.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const url = isEditing 
        ? `/api/admin/volunteers/${isEditing}`
        : '/api/admin/volunteers';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(isEditing ? 'Volunteer updated successfully' : 'Volunteer created successfully');
        setFormData({ name: '', callsign: '', state: '', pin: '', role: 'volunteer' });
        setIsEditing(null);
        fetchVolunteers();
        onVolunteersChange?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save volunteer');
      }
    } catch {
      setError('Network error saving volunteer');
    }
  };

  const handleEdit = (volunteer: Volunteer) => {
    setIsEditing(volunteer.volunteerId);
    setFormData({
      name: volunteer.name,
      callsign: volunteer.callsign,
      state: volunteer.state,
      pin: volunteer.pin,
      role: volunteer.role
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ name: '', callsign: '', state: '', pin: '', role: 'volunteer' });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (volunteerId: number) => {
    setIsDeleting(volunteerId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/volunteers/${volunteerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Volunteer deleted successfully');
        fetchVolunteers();
        onVolunteersChange?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete volunteer');
      }
    } catch {
      setError('Network error deleting volunteer');
    } finally {
      setIsDeleting(null);
      setShowConfirmDelete(null);
    }
  };

  const handleSort = (field: keyof Volunteer) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedVolunteers = volunteers
    .filter(volunteer => 
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.pin.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles.volunteerManagement}>
      {/* Form Section */}
      <div className={styles.formSection}>
        <h4 className={styles.formTitle}>
          {isEditing ? 'Edit Volunteer' : 'Add New Volunteer'}
        </h4>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={styles.formInput}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="callsign">Callsign *</label>
              <input
                id="callsign"
                type="text"
                value={formData.callsign}
                onChange={(e) => setFormData(prev => ({ ...prev, callsign: e.target.value.toUpperCase() }))}
                className={styles.formInput}
                placeholder="Enter callsign"
                required
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="state">State *</label>
              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                className={styles.formInput}
                placeholder="Enter state (e.g., CA)"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="pin">PIN *</label>
              <input
                id="pin"
                type="text"
                value={formData.pin}
                onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                className={styles.formInput}
                placeholder="Enter unique PIN"
                required
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className={styles.formSelect}
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                {isEditing ? 'Update Volunteer' : 'Add Volunteer'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Search and Sort Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.sortControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof Volunteer)}
            className={styles.sortSelect}
          >
            <option value="name">Name</option>
            <option value="callsign">Callsign</option>
            <option value="state">State</option>
            <option value="pin">PIN</option>
            <option value="role">Role</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className={styles.sortButton}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={styles.tableWrapper}>
        <table className={styles.volunteerTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={styles.sortableHeader}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('callsign')} className={styles.sortableHeader}>
                Callsign {sortBy === 'callsign' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('state')} className={styles.sortableHeader}>
                State {sortBy === 'state' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('pin')} className={styles.sortableHeader}>
                PIN {sortBy === 'pin' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('role')} className={styles.sortableHeader}>
                Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedVolunteers.map((volunteer) => (
              <tr key={volunteer.volunteerId}>
                <td>{volunteer.name}</td>
                <td>{volunteer.callsign}</td>
                <td>{volunteer.state}</td>
                <td>{volunteer.pin}</td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[volunteer.role]}`}>
                    {volunteer.role}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleEdit(volunteer)}
                    className={styles.editBtn}
                    disabled={isEditing === volunteer.volunteerId}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(volunteer.volunteerId)}
                    className={styles.deleteBtn}
                    disabled={isDeleting === volunteer.volunteerId}
                  >
                    {isDeleting === volunteer.volunteerId ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.cardView}>
        {filteredAndSortedVolunteers.map((volunteer) => (
          <div key={volunteer.volunteerId} className={styles.volunteerCard}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>{volunteer.name}</h4>
              <span className={`${styles.roleBadge} ${styles[volunteer.role]}`}>
                {volunteer.role}
              </span>
            </div>
            
            <div className={styles.cardDetails}>
              <div className={styles.cardDetail}>
                <span className={styles.cardLabel}>Callsign:</span>
                <span className={styles.cardValue}>{volunteer.callsign}</span>
              </div>
              <div className={styles.cardDetail}>
                <span className={styles.cardLabel}>State:</span>
                <span className={styles.cardValue}>{volunteer.state}</span>
              </div>
              <div className={styles.cardDetail}>
                <span className={styles.cardLabel}>PIN:</span>
                <span className={styles.cardValue}>{volunteer.pin}</span>
              </div>
            </div>
            
            <div className={styles.cardActions}>
              <button
                onClick={() => handleEdit(volunteer)}
                className={styles.editBtn}
                disabled={isEditing === volunteer.volunteerId}
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirmDelete(volunteer.volunteerId)}
                className={styles.deleteBtn}
                disabled={isDeleting === volunteer.volunteerId}
              >
                {isDeleting === volunteer.volunteerId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this volunteer? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => handleDelete(showConfirmDelete)}
                className={styles.confirmDeleteBtn}
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(null)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 