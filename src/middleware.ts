import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || real || 'unknown';
}

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, we'll rely on client-side authentication
    // In a production environment, you'd want to check for a secure session token
    // This is a basic protection - the main protection is in the client-side code
    
    // You could add additional server-side checks here:
    // - Check for admin session cookies
    // - Validate JWT tokens
    // - Check IP whitelist
    // - Rate limiting
    
    // For now, we'll let the client-side handle the authentication
    // but we can add logging for security monitoring
    console.log(`[SECURITY] Admin route accessed: ${request.nextUrl.pathname} from ${getClientIP(request)}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
}; 