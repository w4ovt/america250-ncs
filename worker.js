export default {
  async fetch(request, env, ctx) {
    try {
      // Add cache busting and unique identifiers
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const cacheBuster = `${timestamp}_${randomId}`;
      
      // Fetch data from your API
      const apiUrl = 'https://america250.radio/api/activations/list';
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'America250-NCS-Worker/1.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      let activations = [];
      let tableRows = '';

      if (response.ok) {
        activations = await response.json();
      }

      // Build table rows
      if (activations.length === 0) {
        tableRows = `
          <tr>
            <td colspan="6" style="text-align: center; color: #683f1b; font-style: italic; padding: 20px;">
              No active NCS stations at this time
            </td>
          </tr>
        `;
      } else {
        tableRows = activations.map(activation => {
          const startDate = new Date(activation.startedAt);
          const dateStr = startDate.toLocaleDateString({}, { month: 'short', day: 'numeric' });
          const timeStr = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + 'Z';
          
          // Extract first name from full name
          const firstName = activation.name.split(' ')[0];
          
          return `
            <tr>
              <td style="color: #683f1b; font-weight: bold;">${dateStr}</td>
              <td style="color: #683f1b; font-weight: bold;">${timeStr}</td>
              <td style="color: #683f1b; font-weight: bold;">${firstName} ${activation.callsign}</td>
              <td style="color: #683f1b; font-weight: bold;"><strong>${activation.frequencyMhz}</strong></td>
              <td style="color: #683f1b; font-weight: bold;">${activation.mode}</td>
              <td><span style="background: #155724; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">ON AIR</span></td>
            </tr>
          `;
        }).join('');
      }

      const currentTime = new Date().toLocaleTimeString();

      // Return HTML with 30-second refresh
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="30;url=https://america250-ncs-activations.marc-4b1.workers.dev?_t=${timestamp}&_r=${randomId}&_cb=${cacheBuster}&_v=${Date.now()}">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0, private, no-transform">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="ETag" content="${cacheBuster}">
  <title>America250-NCS Activations</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      font-size: 14px; 
      margin: 0; 
      padding: 10px; 
      background: #f7f1e2;
      color: #683f1b;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      background: #f7f1e2;
      border: 2px solid #683f1b;
    }
    
    th, td { 
      padding: 8px 12px; 
      text-align: center; 
      border: 1px solid #c7a159; 
      font-size: 14px;
    }
    
    th { 
      background: #f7ecd2; 
      color: #683f1b;
      font-weight: bold;
      font-size: 16px;
    }
    
    td {
      color: #683f1b;
      text-align: center;
    }
    
    .footer {
      text-align: center; 
      color: #683f1b; 
      font-size: 12px; 
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #c7a159;
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>NCS</th>
        <th>Freq</th>
        <th>Mode</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  <div class="footer">
    Last updated: ${currentTime.replace(' PM', 'Z').replace(' AM', 'Z')} / ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' })} EDT | Refresh page for latest updates
  </div>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
          'Pragma': 'no-cache',
          'Expires': '0',
          'ETag': cacheBuster,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      // Return error page
      return new Response(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="30">
  <title>America250-NCS - Error</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      font-size: 14px; 
      margin: 0; 
      padding: 10px; 
      background: #f7f1e2;
      color: #683f1b;
      text-align: center;
    }
  </style>
</head>
<body>
  <h3>America250-NCS Activations</h3>
  <p>Unable to load activation data at this time.</p>
  <p>Please check back in a moment.</p>
  <p><small>Error: ${error.message}</small></p>
</body>
</html>`, {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  },
}; 