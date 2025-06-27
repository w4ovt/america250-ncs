export default function QRZActivationsPage() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Volunteer</th>
            <th>Freq</th>
            <th>Mode</th>
            <th>State</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
              No active activations at this time
            </td>
          </tr>
        </tbody>
      </table>
      <div className="footer">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </>
  );
} 