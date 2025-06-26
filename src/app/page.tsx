import ActivationTable from '../components/ActivationTable';

export default function HomePage() {
  return (
    <main>
      <h1 className="homepage-title" style={{ 
        fontSize: '3.5rem', 
        textAlign: 'center', 
        marginBottom: '0.5em',
        color: 'var(--mahogany)',
        textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
      }}>
        AMERICA250
      </h1>
      <h2 className="homepage-subtitle" style={{ 
        textAlign: 'center',
        marginBottom: '2em'
      }}>
        National Communications System
      </h2>
      <section style={{ marginTop: '2em' }}>
        <h3 className="activations-title">
          Live Activations
        </h3>
        <ActivationTable />
      </section>
    </main>
  );
}
