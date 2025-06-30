import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Check environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };
    
    console.log('📧 SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      passConfigured: !!smtpConfig.auth.pass && smtpConfig.auth.pass !== 'your_gmail_app_password_here'
    });
    
    if (!smtpConfig.auth.pass || smtpConfig.auth.pass === 'your_gmail_app_password_here') {
      return NextResponse.json({
        success: false,
        error: 'SMTP_PASS not configured or still using placeholder value'
      }, { status: 400 });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"America250 NCS Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: '🧪 Email Test - America250 NCS System',
      text: 'This is a test email to verify the email configuration is working correctly.\n\nTime: ' + new Date().toISOString(),
      html: `
        <h2>🧪 Email Test - America250 NCS System</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Status:</strong> ✅ Email system is functioning properly</p>
      `
    });
    
    console.log('✅ Test email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      recipient: process.env.SMTP_USER
    });
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 