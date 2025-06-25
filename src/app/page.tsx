export default function HomePage() {
  return (
    <main>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'librebaskerville-bold, serif', marginBottom: '0.5em' }}>
        America250 Activations
      </h1>
      <h2
        style={{
          fontSize: '1.2rem',
          fontFamily: 'librebaskerville-regular, serif',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--mahogany)',
          marginTop: 0,
          marginBottom: '1.5em',
        }}
      >
        Volunteer Dashboard & QRZ Integration
      </h2>
      <button
        style={{
          fontFamily: 'librebaskerville-bold, serif',
          background: 'var(--mahogany)',
          color: 'var(--parchment)',
          border: 'none',
          borderRadius: '6px',
          padding: '0.75em 1.5em',
          fontSize: '1.1rem',
          cursor: 'pointer',
          marginBottom: '2em',
          boxShadow: '0 2px 8px rgba(104, 63, 27, 0.08)',
        }}
        onClick={() => window.open('/ncs-guide.pdf', '_blank', 'noopener,noreferrer')}
      >
        K4A NCS Guide
      </button>
      <section style={{ marginTop: '2em' }}>
        <h3 style={{
          fontFamily: 'librebaskerville-bold, serif',
          color: 'var(--mahogany)',
          fontSize: '1.3rem',
          marginBottom: '0.5em',
        }}>
          Live Activations
        </h3>
        <div style={{ overflowX: 'auto', background: 'var(--linen)', borderRadius: '8px', boxShadow: '0 1px 4px rgba(104,63,27,0.04)', padding: '1em 0.5em', maxWidth: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Callsign</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>State</th>
                <th style={thStyle}>Frequency</th>
                <th style={thStyle}>Mode</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <style jsx>{`
        @media (max-width: 600px) {
          h1 {
            font-size: 2rem;
          }
          table {
            font-size: 0.95rem;
          }
        }
        th, td {
          padding: 0.6em 0.8em;
          text-align: left;
          border-bottom: 1px solid var(--bronze);
        }
        th {
          background: var(--parchment);
          font-family: 'librebaskerville-bold', serif;
          color: var(--mahogany);
          letter-spacing: 0.08em;
        }
        td {
          font-family: 'librebaskerville-regular', serif;
          color: var(--mahogany);
        }
        tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </main>
  );
}

const thStyle = {
  background: 'var(--parchment)',
  fontFamily: 'librebaskerville-bold, serif',
  color: 'var(--mahogany)',
  letterSpacing: '0.08em',
  padding: '0.6em 0.8em',
  textAlign: 'left' as const,
  borderBottom: '1px solid var(--bronze)',
};

const tdStyle = {
  fontFamily: 'librebaskerville-regular, serif',
  color: 'var(--mahogany)',
  padding: '0.6em 0.8em',
  textAlign: 'left' as const,
  borderBottom: '1px solid var(--bronze)',
};
