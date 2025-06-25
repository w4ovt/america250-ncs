import ActivationTable from '../../components/ActivationTable';

export default function IframePage() {
  return (
    <div style={{ 
      padding: '1rem',
      background: 'var(--parchment)',
      minHeight: '100vh',
      fontFamily: 'librebaskerville-regular, serif'
    }}>
      <h3 style={{
        fontFamily: 'librebaskerville-bold, serif',
        color: 'var(--mahogany)',
        fontSize: '1.3rem',
        marginBottom: '0.5em',
        margin: '0 0 1rem 0'
      }}>
        Live Activations
      </h3>
      <ActivationTable />
    </div>
  );
} 