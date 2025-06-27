import ActivationTableIframe from '../../components/ActivationTableIframe';

export default function IframePage() {
  return (
    <div style={{ 
      padding: '0.5rem',
      background: 'transparent',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '0.875rem',
      lineHeight: '1.4'
    }}>
      <h3 style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#495057',
        fontSize: '1rem',
        margin: '0 0 0.75rem 0',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        America250 NCS Live Activations
      </h3>
      <ActivationTableIframe />
    </div>
  );
} 