/**
 * Environment validation utility for production readiness
 * Validates required environment variables on startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
] as const;

const optionalEnvVars = [
  'QRZ_API_KEY',
  'NEON_DATABASE_URL',
] as const;

export function validateEnvironment(): void {
  console.log('🔍 Validating environment configuration...');
  
  const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);
  
  if (missingRequired.length > 0) {
    console.error('❌ Missing required environment variables:', missingRequired);
    console.error('💡 Please set these variables before starting the application');
    process.exit(1);
  }
  
  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:', missingOptional);
    console.warn('💡 Some features may not work without these variables');
  }
  
  console.log('✅ Environment validation passed');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL ? 'configured' : 'missing'}`);
  console.log(`📡 QRZ API: ${process.env.QRZ_API_KEY ? 'configured' : 'missing'}`);
}

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasQrzApiKey: !!process.env.QRZ_API_KEY,
    buildTime: new Date().toISOString(),
  };
} 