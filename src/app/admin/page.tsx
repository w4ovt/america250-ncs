'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ActivationTable from '../../components/ActivationTable';
import AdminDashboard from '../../components/AdminDashboard';
import styles from './page.module.css';

interface VolunteerData {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
  role: 'admin' | 'volunteer';
}

export default function AdminPage() {
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for admin authentication
  useEffect(() => {
    const stored = localStorage.getItem('volunteerAuth');
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        if (authData.role === 'admin') {
          setVolunteerData(authData);
        } else {
          // Not an admin, redirect to volunteer page
          router.push('/volunteer');
        }
      } catch {
        // Invalid stored data, redirect to volunteer page
        router.push('/volunteer');
      }
    } else {
      // No authentication, redirect to volunteer page
      router.push('/volunteer');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <main className={styles.adminPage}>
        <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '300px', height: '2rem', marginBottom: '2rem' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '100%', maxWidth: '200px', height: '1.5rem', marginBottom: '1rem' }}></div>
      </main>
    );
  }

  if (!volunteerData || volunteerData.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <main className={styles.adminPage}>
      <h1 className={styles.adminTitle}>America250 NCS</h1>
      <p className={styles.adminSubtitle}>National Control Station</p>
      
      <h2 className={styles.activationsTitle}>Live Activations</h2>
      <ActivationTable />
      
      <AdminDashboard />
    </main>
  );
} 