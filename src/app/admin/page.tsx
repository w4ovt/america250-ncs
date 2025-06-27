import ActivationTable from '../../components/ActivationTable';
import AdminDashboard from '../../components/AdminDashboard';
import styles from './page.module.css';

export default function AdminPage() {
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