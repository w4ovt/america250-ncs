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
    // Check for volunteerAuth cookie
    const cookie = request.cookies.get('volunteerAuth');
    let isAdmin = false;
    if (cookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(cookie.value));
        if (authData.role === 'admin') {
          isAdmin = true;
        }
      } catch {
        // Invalid cookie, treat as not admin
      }
    }
    if (!isAdmin) {
      console.log(`[SECURITY] BLOCKED admin route: ${request.nextUrl.pathname} from ${getClientIP(request)}`);
      // Redirect unauthorized users to /volunteer
      return NextResponse.redirect(new URL('/volunteer', request.url));
    }
    // Log successful admin access
    console.log(`[SECURITY] ALLOWED admin route: ${request.nextUrl.pathname} from ${getClientIP(request)}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
}; 