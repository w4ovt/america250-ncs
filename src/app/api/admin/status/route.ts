import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { count, sql } from 'drizzle-orm';
import { activations, adiSubmissions, logSubmissions, pins, volunteers } from '../../../../db/schema';

export async function GET() {
  const requestId = `status_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();
  
  try {
    // Get basic counts from each table for health overview
    const pinCountResult = await db().select({ count: count() }).from(pins);
    const volunteerCountResult = await db().select({ count: count() }).from(volunteers);
    const activeActivationCountResult = await db().select({ count: count() }).from(activations).where(sql`ended_at IS NULL`);
    const totalActivationCountResult = await db().select({ count: count() }).from(activations);
    const logSubmissionCountResult = await db().select({ count: count() }).from(logSubmissions);
    const adiSubmissionCountResult = await db().select({ count: count() }).from(adiSubmissions);
    
    const pinCount = pinCountResult[0] || { count: 0 };
    const volunteerCount = volunteerCountResult[0] || { count: 0 };
    const activeActivationCount = activeActivationCountResult[0] || { count: 0 };
    const totalActivationCount = totalActivationCountResult[0] || { count: 0 };
    const logSubmissionCount = logSubmissionCountResult[0] || { count: 0 };
    const adiSubmissionCount = adiSubmissionCountResult[0] || { count: 0 };
    
    const responseTime = Date.now() - startTime;
    
    const response = NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      requestId,
      deployment: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: `${Math.floor(process.uptime())} seconds`,
        nextVersion: process.env.npm_package_version || 'unknown'
      },
      database: {
        connected: true,
        responseTime: `${responseTime}ms`,
        tables: {
          pins: pinCount.count || 0,
          volunteers: volunteerCount.count || 0,
          activeActivations: activeActivationCount.count || 0,
          totalActivations: totalActivationCount.count || 0,
          logSubmissions: logSubmissionCount.count || 0,
          adiSubmissions: adiSubmissionCount.count || 0
        }
      },
      configuration: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasNeonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
        hasQrzApiKey: !!process.env.QRZ_API_KEY,
        nodeVersion: process.version,
        platform: process.platform
      },
      features: {
        pinAuthentication: true,
        activationManagement: true,
        qrzIntegration: !!process.env.QRZ_API_KEY,
        adiUploads: !!process.env.QRZ_API_KEY,
        adminDashboard: true,
        volunteerDashboard: true
      }
    });
    
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Admin-Endpoint', 'true');
    
    return response;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    // Log error for monitoring (would use structured logging in production)
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${requestId}] Admin status error (${responseTime}ms):`, error);
    }
    
    const errorResponse = NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      deployment: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: `${Math.floor(process.uptime())} seconds`
      }
    }, { status: 500 });
    
    errorResponse.headers.set('X-Request-ID', requestId);
    errorResponse.headers.set('X-Response-Time', `${responseTime}ms`);
    errorResponse.headers.set('X-Admin-Endpoint', 'true');
    
    return errorResponse;
  }
} 