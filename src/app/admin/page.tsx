import ActivationTable from '../../components/ActivationTable';
import AdminDashboard from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <main className="container">
      <h1 className="homepage-title">America250 NCS</h1>
      <p className="homepage-subtitle">National Control Station</p>
      
      <h2 className="activations-title">Live Activations</h2>
      <ActivationTable />
      
      <AdminDashboard />
    </main>
  );
} 