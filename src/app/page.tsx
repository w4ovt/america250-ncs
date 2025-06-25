export default function HomePage() {
  return (
    <main>
      <h1 className="homepage-title">
        America250 Activations
      </h1>
      <h2 className="homepage-subtitle">
        Volunteer Dashboard & QRZ Integration
      </h2>
      <button
        className="guide-btn"
        onClick={() => window.open('/ncs-guide.pdf', '_blank', 'noopener,noreferrer')}
      >
        K4A NCS Guide
      </button>
      <section style={{ marginTop: '2em' }}>
        <h3 className="activations-title">
          Live Activations
        </h3>
        <div className="activations-table-wrapper">
          <table className="activations-table">
            <thead>
              <tr>
                <th>Callsign</th>
                <th>Name</th>
                <th>State</th>
                <th>Frequency</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
