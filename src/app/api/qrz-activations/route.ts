import { NextResponse } from 'next/server';
import { eq, isNull } from 'drizzle-orm';
import { db } from '../../../db';
import { activations, volunteers } from '../../../db/schema';

export async function GET() {
  try {
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

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="60">
  <title>America250-NCS Activations</title>
  <style>
    body { 
      font-family: Arial, Helvetica, sans-serif; 
      font-size: 12px; 
      margin: 0; 
      padding: 0; 
      background: white;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 10px; 
      background: white;
    }
    th, td { 
      padding: 3px 5px; 
      border-bottom: 1px solid #eee; 
      text-align: left;
    }
    th { 
      background: #4a4a4a; 
      color: #fff; 
      font-size: 9px; 
      font-weight: bold;
    }
    tr:last-child td { 
      border-bottom: none; 
    }
    .status-active {
      color: #28a745; 
      font-weight: bold; 
      font-size: 9px;
    }
    .volunteer-name {
      font-size: 8px; 
      color: #666;
    }
    .footer {
      text-align: center; 
      color: #999; 
      font-size: 8px; 
      margin-top: 3px;
      border-top: 1px solid #eee;
      padding-top: 3px;
    }
  </style>
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
      ${currentActivations.length === 0 ? 
        '<tr><td colspan="7" style="text-align: center; color: #999; font-style: italic;">No active activations</td></tr>' :
        currentActivations.map((activation) => `
          <tr>
            <td>${formatDate(activation.startedAt)}</td>
            <td>${formatTime(activation.startedAt)}</td>
            <td>
              <strong>${activation.callsign}</strong><br>
              <span class="volunteer-name">${activation.name}</span>
            </td>
            <td><strong>${activation.frequencyMhz}</strong></td>
            <td>${activation.mode}</td>
            <td>${activation.state}</td>
            <td><span class="status-active">ACTIVE</span></td>
          </tr>
        `).join('')
      }
    </tbody>
  </table>
  <div class="footer">
    Last updated: ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating QRZ activations HTML:', error);
    }
    
    return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Error</title>
</head>
<body>
  <p>Error loading activations</p>
</body>
</html>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
} 