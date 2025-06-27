import ActivationTable from '../components/ActivationTable';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="parchment-bg">
      <div className="container">
        {/* Header Image - positioned at the top with same width as Activation Table */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '0.5em',
          padding: '0 20px'
        }}>
          <Image
            src="/america250-ncs-header-image.webp"
            alt="America250 NCS Header"
            width={800}
            height={400}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.15)'
            }}
            priority
          />
        </div>
        
        {/* Title and Subtitle - positioned below image with minimal spacing */}
        <h1 className="homepage-title" style={{ 
          fontSize: '3.5rem', 
          textAlign: 'center', 
          marginBottom: '0.1em',
          marginTop: '0.2em',
          color: 'var(--mahogany)',
          textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
        }}>
          AMERICA250
        </h1>
        <h2 className="homepage-subtitle" style={{ 
          textAlign: 'center',
          marginBottom: '1em',
          marginTop: '0',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '1.2rem',
          fontFamily: 'librebaskerville-bold, serif',
          fontWeight: 'bold'
        }}>
          Signaling the American Spirit
        </h2>
        
        <section style={{ marginTop: '2em' }}>
          <h3 className="activations-title">
            Live Activations
          </h3>
          <ActivationTable />
        </section>
      </div>
    </main>
  );
}
