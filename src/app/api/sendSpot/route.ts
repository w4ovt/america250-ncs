import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { myCall, dx, kHz, info } = await req.json();

    // Validate required fields
    if (!myCall || !dx || !kHz || !info) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: myCall, dx, kHz, info'
      }, { status: 400 });
    }

    // Create form data for DXSummit submission
    const params = new URLSearchParams({
      'myCall': myCall,
      'dx': dx,
      'kHz': kHz.toString(),
      'info': info,
    });

    // Submit to DXSummit's official web form
    const response = await fetch('https://www.dxsummit.fi/SendSpot.aspx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.dxsummit.fi/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      body: params.toString()
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Spot submitted to DXSummit successfully',
        note: 'Check DXSummit for your callsign with "-@" suffix to confirm posting'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `DXSummit submission failed with status: ${response.status}`
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error submitting spot to DXSummit:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 