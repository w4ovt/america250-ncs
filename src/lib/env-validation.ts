/**
 * Environment validation utility for production readiness
 * Validates required environment variables on startup
 */

import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  DATABASE_URL: z.string().url('Invalid DATABASE_URL format'),
  QRZ_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().email('Invalid SMTP_USER email format').optional(),
  SMTP_PASS: z.string().optional(),
});

// Validate environment variables
export function validateEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Validating environment configuration...');
  }
  
  try {
    const parsed = envSchema.parse(process.env);
    
    // Check for missing optional but recommended variables
    const missingOptional: string[] = [];
    
    if (!parsed.QRZ_API_KEY) {
      missingOptional.push('QRZ_API_KEY');
    }
    
    // Check for email configuration - all SMTP settings should be present together
    const smtpVars = [parsed.SMTP_HOST, parsed.SMTP_USER, parsed.SMTP_PASS];
    const hasAnySmtp = smtpVars.some(v => v);
    const hasAllSmtp = smtpVars.every(v => v);
    
    if (hasAnySmtp && !hasAllSmtp) {
      throw new Error('Incomplete SMTP configuration: SMTP_HOST, SMTP_USER, and SMTP_PASS must all be provided together');
    }
    
    if (!hasAllSmtp) {
      missingOptional.push('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS');
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment validation passed');
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log('🔗 Database: configured');
      
      if (parsed.QRZ_API_KEY) {
        console.log('📡 QRZ API: configured');
      } else {
        console.log('📡 QRZ API: missing');
      }
      
      if (hasAllSmtp) {
        console.log('📧 Email: configured');
      } else {
        console.log('📧 Email: missing');
      }
      
      if (missingOptional.length > 0) {
        console.log(`⚠️  Missing optional environment variables: [ '${missingOptional.join("', '")}' ]`);
        console.log('💡 Some features may not work without these variables');
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}

// Validate on import in production
validateEnvironment();

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasQrzApiKey: !!process.env.QRZ_API_KEY,
    buildTime: new Date().toISOString(),
  };
} 