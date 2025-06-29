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
  // Split into records by <eor> (case-insensitive) and filter out empty records
  const records = content.split(/<eor>/i).map(r => r.trim()).filter(r => r.length > 0);
  let recordCount = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record) {
      continue;
    }
    
    // Skip header/comment records that don't contain QSO data
    if (!record.match(/<call:/i)) {
      continue;
    }

    // Check for required K4A callsign in the record (case-insensitive)
    if (!record.toLowerCase().includes('<station_callsign:3>k4a')) {
      return {
        isValid: false,
        recordCount,
        error: `Record ${i + 1} missing required K4A callsign.`
      };
    }
    
    // Basic ADI format validation: must contain < and >
    if (!record.includes('<') || !record.includes('>')) {
      return {
        isValid: false,
        recordCount,
        error: `Record ${i + 1} has invalid ADI format.`
      };
    }
    
    recordCount++;
  }

  if (recordCount === 0) {
    return {
      isValid: false,
      recordCount: 0,
      error: 'No valid ADI QSO records found in file.'
    };
  }

  return { isValid: true, recordCount };
}

async function submitToQRZ(fileContent: string): Promise<{ success: boolean; count?: number; logId?: string; error?: string }> {
  // QRZ submission started
  
  try {
    // Remove header content (everything before the first <Call: field)
    const callIndex = fileContent.indexOf('<Call:');
    if (callIndex === -1) {
      return {
        success: false,
        error: 'No QSO records found in ADIF file'
      };
    }
    
    // Extract only the QSO records (everything from first <Call: onwards)
    const qsoContent = fileContent.substring(callIndex);
    
    // Split the QSO content into individual QSO records
    const records = qsoContent.split(/<eor>/i).map(r => r.trim()).filter(r => r.length > 0);
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
        // QRZ API success
      } else if (result === 'FAIL' && reason && reason.includes('duplicate')) {
        // Duplicate records should be treated as success since they already exist
        successCount++;
        if (logId) lastLogId = logId;
        // QRZ API duplicate (treated as success)
      } else {
        console.error('QRZ API failed for record:', {
          result,
          reason,
          record: singleRecord.substring(0, 100) + '...'
        });
      }
    }
    
    if (successCount > 0) {
        // QRZ submission completed successfully
      
      return {
        success: true,
        count: successCount,
        logId: lastLogId
      };
    } else {
        // QRZ submission failed - no records uploaded
      
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

    const emailBody = `
ADI File Upload Failure Alert

Volunteer Details:
- Name: ${volunteerData.name}
- Callsign: ${volunteerData.callsign}
- State: ${volunteerData.state}
- Volunteer ID: ${volunteerData.volunteerId}

File Details:
- Filename: ${filename}
- Upload Time: ${new Date().toISOString()}
- Error: ${error}

The rejected ADI file is attached to this email for your review.

Please contact the volunteer if manual processing is required.

---
America250-NCS System
Automated Alert
    `.trim();

    const mailOptions = {
      from: process.env.SMTP_USER || `"America250-NCS System" <noreply@america250.radio>`,
      to: 'marc@history.radio',
      subject: `🚨 ADI Upload Failure: ${filename} from ${volunteerData.callsign}`,
      text: emailBody,
      attachments: [
        {
          filename: filename,
          content: fileContent,
          contentType: 'text/plain'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Failure email sent successfully to marc@history.radio');
    }

  } catch (emailError) {
    console.error('❌ Failed to send failure email:', emailError);
    
    // Fallback: At least log the critical details so they're not lost
    console.error('🚨 CRITICAL: ADI Upload Failure (Email Failed):', {
      filename,
      error,
      volunteer: volunteerData,
      timestamp: new Date().toISOString(),
      fileContentPreview: fileContent.substring(0, 200) + '...'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadRequest = await request.json();
    const { filename, fileContent, volunteerData } = body;
    
    // Validate file format and content
    const validation = validateAdiFile(fileContent);
    
    if (!validation.isValid) {
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
      
      // Send failure email
      await sendFailureEmail(filename, validation.error!, volunteerData, fileContent);
      
      return NextResponse.json({
        success: false,
        error: 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.',
        recordCount: validation.recordCount
      }, { status: 400 });
    }
    
    // Submit to QRZ
    const qrzResult = await submitToQRZ(fileContent);
    
    if (!qrzResult.success) {
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
      
      // Send failure email
      await sendFailureEmail(filename, qrzResult.error!, volunteerData, fileContent);
      
      return NextResponse.json({
        success: false,
        error: 'ERROR: Your .adi file contains errors. Contact Marc W4OVT for assistance.',
        recordCount: validation.recordCount
      }, { status: 500 });
    }
    
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
    
    return NextResponse.json({
      success: true,
      recordCount: qrzResult.count || validation.recordCount,
      message: `SUCCESS: ${qrzResult.count || validation.recordCount} Contacts Have Been Uploaded to the K4A QRZ Logbook. Thank you for Volunteering!`
    });
    
  } catch (error) {
    console.error('ADI upload error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error during file processing'
    }, { status: 500 });
  }
} 