import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { logSubmissions, adiSubmissions } from '../../../../db/schema';
import nodemailer from 'nodemailer';

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

function validateAdiFile(content: string): { isValid: boolean; recordCount: number; error?: string } {
  // Remove header content (everything before the first <Call: field)
  const callIndex = content.indexOf('<Call:');
  if (callIndex === -1) {
    console.log('❌ No QSO records found in ADIF file');
    return {
      isValid: false,
      recordCount: 0,
      error: 'No QSO records found in ADIF file. File must contain at least one <Call: field.'
    };
  }
  
  // Extract only the QSO records (everything from first <Call: onwards)
  const qsoContent = content.substring(callIndex);
  
  // Split into records by <eor> (case-insensitive) and filter out empty records
  const records = qsoContent.split(/<eor>/i).map(r => r.trim()).filter(r => r.length > 0);
  let recordCount = 0;

  console.log(`🔍 Validating ${records.length} potential QSO records...`);

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record) {
      console.log(`⏭️ Skipping empty record ${i + 1}`);
      continue;
    }
    
    console.log(`📝 Record ${i + 1} preview: ${record.substring(0, 100)}...`);
    
    // Very permissive validation - just check for basic ADI structure
    // Must contain at least one field with < and > format
    if (!record.match(/<[^>]+:[^>]*>/)) {
      console.log(`❌ Record ${i + 1} missing ADI field format`);
      continue;
    }
    
    // Must contain a callsign field (any of the common variations)
    if (!record.match(/<(call|station_callsign|operator):/i)) {
      console.log(`❌ Record ${i + 1} missing callsign field`);
      continue;
    }
    
    recordCount++;
    console.log(`✅ Record ${i + 1} validated`);
  }

  console.log(`📊 Total valid records found: ${recordCount}`);

  if (recordCount === 0) {
    return {
      isValid: false,
      recordCount: 0,
      error: 'No valid ADI QSO records found in file. Each record must contain at least one callsign field (<call:>, <station_callsign:>, or <operator:>).'
    };
  }

  return { isValid: true, recordCount };
}

async function submitToQRZ(fileContent: string): Promise<{ success: boolean; count?: number; logId?: string; error?: string }> {
  // QRZ submission started
  console.log('🔍 Starting QRZ submission...');
  
  try {
    // Remove header content (everything before the first <Call: field)
    const callIndex = fileContent.indexOf('<Call:');
    if (callIndex === -1) {
      console.log('❌ No QSO records found in ADIF file');
      return {
        success: false,
        error: 'No QSO records found in ADIF file'
      };
    }
    
    // Extract only the QSO records (everything from first <Call: onwards)
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

async function sendFailureEmail(filename: string, error: string, volunteerData: {
  volunteerId: number;
  name: string;
  callsign: string;
  state: string;
}, fileContent: string): Promise<void> {
  try {
    // Validate SMTP configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP credentials not configured - cannot send failure email');
      return;
    }

    // Create transporter - using environment variables for email config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Validate inputs before using them
    const safeFilename = filename || 'unknown-file.adi';
    const safeError = error || 'Unknown error';
    const safeVolunteerData = {
      name: volunteerData?.name || 'Unknown',
      callsign: volunteerData?.callsign || 'Unknown',
      state: volunteerData?.state || 'Unknown',
      volunteerId: volunteerData?.volunteerId || 0
    };

    const emailBody = `
ADI File Upload Failure Alert

Volunteer Details:
- Name: ${safeVolunteerData.name}
- Callsign: ${safeVolunteerData.callsign}
- State: ${safeVolunteerData.state}
- Volunteer ID: ${safeVolunteerData.volunteerId}

File Details:
- Filename: ${safeFilename}
- Upload Time: ${new Date().toISOString()}
- Error: ${safeError}

The rejected ADI file is attached as a .txt file for your review.
(Original filename: ${safeFilename})

Please contact the volunteer if manual processing is required.

---
America250-NCS System
Automated Alert
    `.trim();

    // Create safe filename for attachment (change .adi to .txt to avoid Apple security warnings)
    const attachmentFilename = safeFilename.replace(/\.adi$/i, '.txt') || 'rejected-file.txt';
    
    // Safely create buffer and base64 content
    let contentBase64 = '';
    try {
      const contentBuffer = Buffer.from(fileContent || '', 'utf8');
      contentBase64 = contentBuffer.toString('base64');
    } catch (bufferError) {
      console.error('❌ Failed to create attachment buffer:', bufferError);
      contentBase64 = Buffer.from('Error: Could not process file content', 'utf8').toString('base64');
    }

    const mailOptions = {
      from: `"America250-NCS System" <${process.env.SMTP_USER}>`,
      to: 'marc@history.radio',
      subject: `🚨 ADI Upload Failure: ${safeFilename} from ${safeVolunteerData.callsign}`,
      text: emailBody,
      attachments: [
        {
          filename: attachmentFilename,
          content: contentBase64,
          contentType: 'text/plain',
          encoding: 'base64'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[ADI FAILURE EMAIL SENT]', {
      filename: safeFilename,
      error: safeError,
      volunteer: safeVolunteerData,
      timestamp: new Date().toISOString(),
      fileContentPreview: (fileContent || '').substring(0, 200) + '...',
      messageId: info.messageId
    });
  } catch (emailError) {
    console.error('❌ Failed to send failure email:', emailError);
    // Fallback: At least log the critical details so they're not lost
    console.error('🚨 CRITICAL: ADI Upload Failure (Email Failed):', {
      filename: filename || 'unknown',
      error: error || 'unknown',
      volunteer: volunteerData || 'unknown',
      timestamp: new Date().toISOString(),
      fileContentPreview: (fileContent || '').substring(0, 200) + '...'
    });
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 ADI upload request received');
  try {
    const body: UploadRequest = await request.json();
    const { filename, fileContent, volunteerData } = body;
    console.log('📄 Processing file:', filename, 'for volunteer:', volunteerData?.callsign);
    
    // Validate file format and content
    console.log('🔍 Validating ADIF file...');
    const validation = validateAdiFile(fileContent);
    console.log('✅ Validation result:', validation.isValid, 'Record count:', validation.recordCount);
    
    if (!validation.isValid) {
      console.log('❌ File validation failed:', validation.error);
      // Store failure in database
      await db().insert(logSubmissions).values({
        filename,
        callsign: volunteerData.callsign,
        name: volunteerData.name,
        result: 'failure',
        recordCount: validation.recordCount,
      });
      
      // Store in new ADI submissions table
      await db().insert(adiSubmissions).values({
        volunteerId: volunteerData.volunteerId,
        filename,
        fileContent,
        recordCount: validation.recordCount,
        processedCount: 0,
        status: 'rejected'
      });
      
      // Send failure email (with robust logging)
      console.log('📧 Sending validation failure email...');
      await sendFailureEmail(filename, validation.error!, volunteerData, fileContent);
      
      return NextResponse.json({
        success: false,
        error: 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.',
        recordCount: validation.recordCount
      }, { status: 400 });
    }
    
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
        recordCount: validation.recordCount,
      });
      
      // Store in new ADI submissions table
      await db().insert(adiSubmissions).values({
        volunteerId: volunteerData.volunteerId,
        filename,
        fileContent,
        recordCount: validation.recordCount,
        processedCount: 0,
        status: 'rejected'
      });
      
      // Send failure email (with robust logging)
      console.log('📧 Sending QRZ failure email...');
      await sendFailureEmail(filename, qrzResult.error!, volunteerData, fileContent);
      
      return NextResponse.json({
        success: false,
        error: 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.',
        recordCount: validation.recordCount
      }, { status: 500 });
    }
    
    console.log('✅ QRZ submission successful, storing in database...');
    // Store success in database
    await db().insert(logSubmissions).values({
      filename,
      callsign: volunteerData.callsign,
      name: volunteerData.name,
      result: 'success',
      recordCount: qrzResult.count || validation.recordCount,
    });
    
    // Store in new ADI submissions table
    await db().insert(adiSubmissions).values({
      volunteerId: volunteerData.volunteerId,
      filename,
      fileContent,
      recordCount: validation.recordCount,
      processedCount: qrzResult.count || 0,
      status: 'success'
    });
    
    console.log('✅ ADI upload completed successfully');
    return NextResponse.json({
      success: true,
      recordCount: qrzResult.count || validation.recordCount,
      message: `SUCCESS: ${qrzResult.count || validation.recordCount} Contacts Have Been Uploaded to the K4A QRZ Logbook. Thank you for Volunteering!`
    });
    
  } catch (error) {
    console.error('💥 ADI upload error:', error);
    // Defensive: try to send a failure email if possible
    try {
      const { filename, fileContent, volunteerData } = (typeof request !== 'undefined' && request.json) ? await request.json() : {};
      if (filename && fileContent && volunteerData) {
        console.log('📧 Sending fallback failure email...');
        await sendFailureEmail(filename, 'Internal server error during file processing', volunteerData, fileContent);
      }
    } catch (emailError) {
      console.error('❌ Failed to send fallback failure email:', emailError);
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error during file processing'
    }, { status: 500 });
  }
} 