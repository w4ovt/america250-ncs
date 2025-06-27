export default {
  async fetch(request, env, ctx) {
    // Set CORS headers for iframe compatibility
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'text/html; charset=utf-8',
    };

    try {
      // Fetch activation data from your API
      const response = await fetch('https://america250.radio/api/activations/list');
      const activations = await response.json();

      // Format the data
      let tableRows = '';
      if (activations.length === 0) {
        tableRows = '<tr><td colspan="6" style="text-align: center; color: #683f1b; font-style: italic; padding: 2rem; font-family: \'librebaskerville-bold\', serif;">No active activations</td></tr>';
      } else {
        tableRows = activations.map(activation => {
          const startDate = new Date(activation.startedAt);
          const dateStr = startDate.toLocaleDateString({}, { month: 'short', day: 'numeric' });
          const timeStr = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + 'Z';
          
          // Extract first name from full name
          const firstName = activation.name.split(' ')[0];
          
          return `
            <tr>
              <td style="font-family: \'librebaskerville-bold\', serif; color: #683f1b;">${dateStr}</td>
              <td style="font-family: \'librebaskerville-bold\', serif; color: #683f1b;">${timeStr}</td>
              <td style="font-family: \'librebaskerville-bold\', serif; color: #683f1b;">${firstName} ${activation.callsign}</td>
              <td style="font-family: \'librebaskerville-bold\', serif; color: #683f1b;"><strong>${activation.frequencyMhz}</strong></td>
              <td style="font-family: \'librebaskerville-bold\', serif; color: #683f1b;">${activation.mode}</td>
              <td><span class="status-onair">ON AIR</span></td>
            </tr>
          `;
        }).join('');
      }

      const currentTime = new Date().toLocaleTimeString();

      // Return the complete HTML with enhanced styling
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="60">
  <title>America250-NCS Activations</title>
  <style>
    @font-face {
      font-family: 'librebaskerville-bold';
      src: url('https://america250.radio/fonts/librebaskerville-bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    
    body { 
      font-family: 'librebaskerville-bold', serif; 
      font-size: 14px; 
      margin: 0; 
      padding: 20px; 
      background: #f7f1e2;
      color: #683f1b;
      border: 4px solid #683f1b;
      border-radius: 8px;
      box-sizing: border-box;
    }
    
    .table-wrapper {
      overflow-x: auto;
      background: #f7f1e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(104,63,27,0.15);
      padding: 1em 0.5em;
      max-width: 100%;
      border: 4px solid #683f1b;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      min-width: 600px;
      background: #f7f1e2;
      border-radius: 8px;
      overflow: hidden;
    }
    
    th, td { 
      padding: 0.8em 1em; 
      text-align: center; 
      border-bottom: 1px solid #c7a159; 
      font-size: 1rem;
    }
    
    th { 
      background: #f7ecd2; 
      font-family: 'librebaskerville-bold', serif;
      color: #683f1b;
      font-weight: bold;
      font-size: 1.3rem;
      letter-spacing: 0.08em;
      text-shadow: 1px 1px 2px rgba(104,63,27,0.2);
      box-shadow: 0 2px 4px rgba(104,63,27,0.1);
    }
    
    td {
      font-family: 'librebaskerville-bold', serif;
      color: #683f1b;
      text-align: center;
    }
    
    tr:last-child td { 
      border-bottom: none; 
    }
    
    .status-onair {
      background: #155724;
      color: #f7f1e2;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-family: 'librebaskerville-bold', serif;
      font-size: 0.9rem;
      text-transform: uppercase;
      border: 2px solid #0d3d17;
      font-weight: bold;
      letter-spacing: 0.1em;
      box-shadow: 0 2px 4px rgba(21,87,36,0.3);
    }
    
    .footer {
      text-align: center; 
      color: #683f1b; 
      font-size: 0.8rem; 
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      border-top: 1px solid #c7a159;
      padding-top: 0.5rem;
      font-family: 'librebaskerville-bold', serif;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 15px;
      }
      
      .table-wrapper {
        padding: 0.75rem 0.25rem;
      }
      
      table {
        font-size: 0.9rem;
        min-width: 450px;
      }
      
      th, td {
        padding: 0.6rem 0.5rem;
      }
      
      th {
        font-size: 1.1rem;
      }
    }
  </style>
</head>
<body>
  <div class="table-wrapper">
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
  </div>
  <div class="footer">
    Last updated: ${currentTime}
  </div>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: corsHeaders,
      });

    } catch (error) {
      // Return error page if API is down
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="60">
  <title>America250-NCS Activations</title>
  <style>
    @font-face {
      font-family: 'librebaskerville-bold';
      src: url('https://america250.radio/fonts/librebaskerville-bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    
    body { 
      font-family: 'librebaskerville-bold', serif; 
      font-size: 14px; 
      margin: 0; 
      padding: 20px; 
      background: #f7f1e2;
      color: #683f1b;
      border: 4px solid #683f1b;
      border-radius: 8px;
      box-sizing: border-box;
    }
    
    .table-wrapper {
      overflow-x: auto;
      background: #f7f1e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(104,63,27,0.15);
      padding: 1em 0.5em;
      max-width: 100%;
      border: 4px solid #683f1b;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      min-width: 600px;
      background: #f7f1e2;
      border-radius: 8px;
      overflow: hidden;
    }
    
    th, td { 
      padding: 0.8em 1em; 
      text-align: center; 
      border-bottom: 1px solid #c7a159; 
      font-size: 1rem;
    }
    
    th { 
      background: #f7ecd2; 
      font-family: 'librebaskerville-bold', serif;
      color: #683f1b;
      font-weight: bold;
      font-size: 1.3rem;
      letter-spacing: 0.08em;
      text-shadow: 1px 1px 2px rgba(104,63,27,0.2);
      box-shadow: 0 2px 4px rgba(104,63,27,0.1);
    }
    
    td {
      font-family: 'librebaskerville-bold', serif;
      color: #683f1b;
      text-align: center;
    }
    
    .footer {
      text-align: center; 
      color: #683f1b; 
      font-size: 0.8rem; 
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      border-top: 1px solid #c7a159;
      padding-top: 0.5rem;
      font-family: 'librebaskerville-bold', serif;
    }
  </style>
</head>
<body>
  <div class="table-wrapper">
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
        <tr>
          <td colspan="6" style="text-align: center; color: #683f1b; font-style: italic; padding: 2rem; font-family: 'librebaskerville-bold', serif;">
            Error loading activations
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="footer">
    Last updated: ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>`;

      return new Response(errorHtml, {
        status: 200,
        headers: corsHeaders,
      });
    }
  },
}; 