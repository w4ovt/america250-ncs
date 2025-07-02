import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { logSubmissions, adiSubmissions } from '../../../../db/schema';

const QRZ_API_KEY = process.env.QRZ_API_KEY || '';

if (!QRZ_API_KEY) {
  console.error('QRZ_API_KEY environment variable is not set - ADI uploads will fail');
}

interface UploadRequest {
  filename: string;
  fileContent: string;
  volunteerData: {
    volunteerId: number;
    name: string;
    callsign: string;
    state: string;
  };
}

async function submitToQRZ(fileContent: string): Promise<{ success: boolean; count?: number; logId?: string; error?: string }> {
  // QRZ submission started
  console.log('🔍 Starting QRZ submission...');
  
  try {
    // Remove header content (everything before the first <call: field, case-insensitive)
    const callMatch = fileContent.match(/<call:/i);
    const callIndex = callMatch ? callMatch.index : -1;
    if (callIndex === -1) {
      console.log('❌ No QSO records found in ADIF file');
      return {
        success: false,
        error: 'No QSO records found in ADIF file'
      };
    }
    
    // Extract only the QSO records (everything from first <call: onwards)
    const qsoContent = fileContent.substring(callIndex);
    
    // Split the QSO content into individual QSO records
    const records = qsoContent.split(/<eor>/i).map(r => r.trim()).filter(r => r.length > 0);
    console.log(`📊 Processing ${records.length} QSO records...`);
    let successCount = 0;
    let lastLogId = '';
    
    // Process each QSO record individually
    for (const record of records) {
      // Skip records that don't contain QSO data (shouldn't happen now, but safety check)
      if (!record.match(/<call:/i)) {
        continue;
      }
      
      // Add <eor> back to the individual record
      const singleRecord = record + '<eor>';
      
      // Create the QRZ logbook submission for this single record
      const qrzData = {
        KEY: QRZ_API_KEY,
        ACTION: 'INSERT',
        ADIF: singleRecord
      };
      
      // Make the API call to QRZ
      const requestBody = new URLSearchParams(qrzData).toString();
      
      const response = await fetch('https://logbook.qrz.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'America250-NCS/1.0.0 (W4OVT)'
        },
        body: requestBody
      });
      
      const responseText = await response.text();
      
      // QRZ API response received
      
      // Parse the response
      const responseParams = new URLSearchParams(responseText);
      const result = responseParams.get('RESULT');
      const logId = responseParams.get('LOGID');
      // Note: COUNT parameter is available but not currently used
      const reason = responseParams.get('REASON');
      
      // Handle different response scenarios
      if (result === 'OK' || result === 'REPLACE') {
        successCount++;
        if (logId) lastLogId = logId;
        console.log('✅ QRZ API success for record');
      } else if (result === 'FAIL' && reason && reason.includes('duplicate')) {
        // Duplicate records should be treated as success since they already exist
        successCount++;
        if (logId) lastLogId = logId;
        console.log('✅ QRZ API duplicate (treated as success)');
      } else {
        console.error('QRZ API failed for record:', {
          result,
          reason,
          record: singleRecord.substring(0, 100) + '...'
        });
      }
    }
    
    console.log(`📊 QRZ submission complete. Success count: ${successCount}`);
    
    if (successCount > 0) {
      // QRZ submission completed successfully
      console.log('✅ QRZ submission completed successfully');
      return {
        success: true,
        count: successCount,
        logId: lastLogId
      };
    } else {
      // QRZ submission failed - no records uploaded
      console.log('❌ QRZ submission failed - no records uploaded');
      return {
        success: false,
        error: 'No records were successfully uploaded to QRZ'
      };
    }
    
  } catch (error) {
    // QRZ submission error occurred
    console.error('QRZ API error:', error);
    return {
      success: false,
      error: `QRZ API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 ADI upload request received');
  try {
    const body: UploadRequest = await request.json();
    const { filename, fileContent, volunteerData } = body;
    console.log('📄 Processing file:', filename, 'for volunteer:', volunteerData?.callsign);

    // Submit to QRZ
    console.log('📡 Submitting to QRZ...');
    const qrzResult = await submitToQRZ(fileContent);
    console.log('📡 QRZ result:', qrzResult.success, qrzResult.error);

    if (!qrzResult.success) {
      console.log('❌ QRZ submission failed:', qrzResult.error);
      // Store failure in database
      await db().insert(logSubmissions).values({
        filename,
        callsign: volunteerData.callsign,
        name: volunteerData.name,
        result: 'failure',
        recordCount: 0,
      });
      // Store in new ADI submissions table
      await db().insert(adiSubmissions).values({
        volunteerId: volunteerData.volunteerId,
        filename,
        fileContent,
        recordCount: 0,
        processedCount: 0,
        status: 'rejected'
      });
      // No more failure email
      return NextResponse.json({
        success: false,
        error: 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.',
        recordCount: 0
      }, { status: 500 });
    }

    console.log('✅ QRZ submission successful, storing in database...');
    // Store success in database
    await db().insert(logSubmissions).values({
      filename,
      callsign: volunteerData.callsign,
      name: volunteerData.name,
      result: 'success',
      recordCount: qrzResult.count || 0,
    });
    // Store in new ADI submissions table
    await db().insert(adiSubmissions).values({
      volunteerId: volunteerData.volunteerId,
      filename,
      fileContent,
      recordCount: qrzResult.count || 0,
      processedCount: qrzResult.count || 0,
      status: 'success'
    });
    console.log('✅ ADI upload completed successfully');
    return NextResponse.json({
      success: true,
      recordCount: qrzResult.count || 0,
      message: `SUCCESS: ${qrzResult.count || 0} Contacts Have Been Uploaded to the K4A QRZ Logbook. Thank you for Volunteering!`
    });
  } catch (error) {
    console.error('💥 ADI upload error:', error);
    // No more fallback failure email
    return NextResponse.json({
      success: false,
      error: 'Internal server error during file processing'
    }, { status: 500 });
  }
} 