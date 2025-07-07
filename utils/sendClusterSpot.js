const { Telnet } = require('telnet-client');

async function sendClusterSpot({ myCall, dxCall, freq, info }) {
  let connection = new Telnet();
  let params = {
    host: 've7cc.net',   // Connect directly to VE7CC cluster
    port: 23,            // Or 7373 if 23 is blocked
    negotiationMandatory: false,
    timeout: 5000,
    shellPrompt: '',     // No prompt expected
    ors: false,
    debug: true,
  };

  try {
    await connection.connect(params);
    // Wait for login prompt or welcome message
    let welcome = await connection.send('', {waitfor: 'login:'});
    console.log('Cluster welcome/login prompt:', welcome);

    // Step 1: Log in with your callsign
    let loginResp = await connection.send(myCall, {waitfor: />/});
    console.log('Login response:', loginResp);

    // Step 2: Format the spot string as required by the cluster protocol
    const spot = `DX de ${myCall}: ${freq} ${dxCall} ${info}`;
    let spotResp = await connection.send(spot, {waitfor: />/});
    console.log('Spot response:', spotResp);

    await connection.end();
    return { welcome, loginResp, spotResp };
  } catch (error) {
    console.error('Error sending spot:', error);
    try { await connection.end(); } catch {}
    throw new Error('Telnet error: ' + (error && error.message ? error.message : error));
  }
}

module.exports = sendClusterSpot; 