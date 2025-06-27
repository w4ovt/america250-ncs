import { db } from '../../../db';
import { activations, volunteers } from '../../../db/schema';
import { isNull, eq } from 'drizzle-orm';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QRZActivationsPage() {
  // Get the database instance
  const database = db();
  // Join activations with volunteers
  const currentActivations = await database
    .select({
      activationId: activations.activationId,
      frequencyMhz: activations.frequencyMhz,
      mode: activations.mode,
      startedAt: activations.startedAt,
      name: volunteers.name,
      callsign: volunteers.callsign,
      state: volunteers.state,
    })
    .from(activations)
    .leftJoin(volunteers, eq(activations.volunteerId, volunteers.volunteerId))
    .where(isNull(activations.endedAt))
    .orderBy(activations.startedAt);

  const formatTime = (timeValue: Date | string | null) => {
    if (!timeValue) return 'N/A';
    const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeValue: Date | string | null) => {
    if (!timeValue) return 'N/A';
    const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="60" />
        <title>America250-NCS Activations</title>
        <style>{`
          body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; margin: 0; padding: 0; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { padding: 3px 5px; border-bottom: 1px solid #eee; }
          th { background: #4a4a4a; color: #fff; font-size: 9px; }
          tr:last-child td { border-bottom: none; }
        `}</style>
      </head>
      <body>
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
            {currentActivations.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                  No active activations
                </td>
              </tr>
            ) : (
              currentActivations.map((activation) => (
                <tr key={activation.activationId}>
                  <td>{formatDate(activation.startedAt)}</td>
                  <td>{formatTime(activation.startedAt)}</td>
                  <td>
                    <strong>{activation.callsign}</strong>
                    <br />
                    <span style={{ fontSize: '8px', color: '#666' }}>{activation.name}</span>
                  </td>
                  <td><strong>{activation.frequencyMhz}</strong></td>
                  <td>{activation.mode}</td>
                  <td>{activation.state}</td>
                  <td>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '9px' }}>
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', color: '#999', fontSize: '8px', marginTop: '3px' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </body>
    </html>
  );
} 