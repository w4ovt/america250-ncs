import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { pins } from '../../../db/schema';

export async function GET() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    // Test database connectivity
    await db().select().from(pins).limit(1);
    const dbConnected = true;
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'healthy',
      timestamp,
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      build: {
        timestamp: process.env.BUILD_TIMESTAMP || timestamp,
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown',
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
      },
      services: {
        database: {
          status: dbConnected ? 'connected' : 'disconnected',
          provider: 'neon-postgresql'
        },
        qrz: {
          status: process.env.QRZ_API_KEY ? 'configured' : 'missing',
          integration: !!process.env.QRZ_API_KEY
        },
      },
      environment_variables: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
        QRZ_API_KEY: !!process.env.QRZ_API_KEY,
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
      features: {
        adiUploads: !!process.env.QRZ_API_KEY,
        qrzIntegration: !!process.env.QRZ_API_KEY,
        volunteerPortal: true,
        adminDashboard: true,
        activationTracking: true,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        }
      }
    };

    return NextResponse.json(healthData);
    
  } catch {
    const responseTime = Date.now() - startTime;
    
    const errorData = {
      status: 'unhealthy',
      timestamp,
      responseTime: `${responseTime}ms`,
      error: 'Database connection failed',
      environment: process.env.NODE_ENV || 'development',
      environment_variables: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
        QRZ_API_KEY: !!process.env.QRZ_API_KEY,
      }
    };

    return NextResponse.json(errorData, { status: 503 });
  }
} 