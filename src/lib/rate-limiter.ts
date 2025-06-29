import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blocked: boolean;
    blockedUntil?: number;
  };
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs?: number;
  skipSuccessfulRequests?: boolean;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  blocked?: boolean;
  blockedUntil?: number;
}

/**
 * Rate limiter for API endpoints
 * @param request - NextRequest object
 * @param identifier - Unique identifier (IP, PIN, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  request: NextRequest,
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${request.nextUrl.pathname}`;
  
  // Initialize or get existing rate limit data
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + config.windowMs,
      blocked: false
    };
  }
  
  const limitData = rateLimitStore[key];
  
  // Check if currently blocked
  if (limitData.blocked && limitData.blockedUntil && now < limitData.blockedUntil) {
    const result: RateLimitResult = {
      success: false,
      limit: config.maxAttempts,
      remaining: 0,
      resetTime: limitData.resetTime,
      blocked: true
    };
    
    if (limitData.blockedUntil) {
      result.blockedUntil = limitData.blockedUntil;
    }
    
    return result;
  }
  
  // Reset if window has expired
  if (now > limitData.resetTime) {
    limitData.count = 0;
    limitData.resetTime = now + config.windowMs;
    limitData.blocked = false;
    delete limitData.blockedUntil;
  }
  
  // Increment count
  limitData.count++;
  
  // Check if limit exceeded
  if (limitData.count > config.maxAttempts) {
    limitData.blocked = true;
    if (config.blockDurationMs) {
      limitData.blockedUntil = now + config.blockDurationMs;
    }
    
    const result: RateLimitResult = {
      success: false,
      limit: config.maxAttempts,
      remaining: 0,
      resetTime: limitData.resetTime,
      blocked: true
    };
    
    if (limitData.blockedUntil) {
      result.blockedUntil = limitData.blockedUntil;
    }
    
    return result;
  }
  
  return {
    success: true,
    limit: config.maxAttempts,
    remaining: config.maxAttempts - limitData.count,
    resetTime: limitData.resetTime
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const clientIP = forwarded?.split(',')[0] || real || 'unknown';
  return clientIP;
}

/**
 * Rate limiter specifically for PIN authentication
 */
export function rateLimitPinAuth(request: NextRequest, pin?: string): RateLimitResult {
  const clientIP = getClientIP(request);
  const identifier = pin ? `pin:${pin}` : `ip:${clientIP}`;
  
  return rateLimit(request, identifier, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 10,
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
    skipSuccessfulRequests: true
  });
}

/**
 * Rate limiter for file uploads
 */
export function rateLimitFileUpload(request: NextRequest): RateLimitResult {
  const clientIP = getClientIP(request);
  
  return rateLimit(request, `upload:${clientIP}`, {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 20,
    blockDurationMs: 2 * 60 * 60 * 1000 // 2 hour block
  });
}

/**
 * Rate limiter for admin endpoints
 */
export function rateLimitAdmin(request: NextRequest): RateLimitResult {
  const clientIP = getClientIP(request);
  
  return rateLimit(request, `admin:${clientIP}`, {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 30,
    blockDurationMs: 5 * 60 * 1000 // 5 minute block
  });
}

/**
 * Cleanup expired rate limit entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  for (const [key, data] of Object.entries(rateLimitStore)) {
    // Remove expired entries
    if (now > data.resetTime && (!data.blockedUntil || now > data.blockedUntil)) {
      delete rateLimitStore[key];
    }
  }
}

// Cleanup expired entries every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000); 