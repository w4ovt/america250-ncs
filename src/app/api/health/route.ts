import { NextResponse } from 'next/server';
import { db } from '../../../db';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test database connectivity with a simple query
    const result = await db().execute('SELECT 1 as health_check');
    const dbResponseTime = Date.now() - startTime;
    
    // Verify environment variables (without exposing values)
    const envChecks = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      QRZ_API_KEY: !!process.env.QRZ_API_KEY,
      hasDbConnection: !!result
    };
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: true,
        responseTime: `${dbResponseTime}ms`
      },
      environment: envChecks,
      version: '1.0.0',
      deployment: 'america250-ncs'
    });
    
  } catch (error) {
    const dbResponseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: false,
        responseTime: `${dbResponseTime}ms`,
        error: error instanceof Error ? error.message : 'Unknown database error'
      },
      environment: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
        QRZ_API_KEY: !!process.env.QRZ_API_KEY,
        hasDbConnection: false
      },
      version: '1.0.0',
      deployment: 'america250-ncs'
    }, { status: 503 });
  }
} 