import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_DASHBOARD_PREFIXES = [
  '/dashboard/settings',
  '/dashboard/friends',
  '/dashboard/games',
  '/dashboard/multiplayer',
];

const NO_STORE_PREFIXES = [
  '/dashboard',
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

function isPrivateRoute(pathname: string): boolean {
  if (pathname === '/dashboard') return true;
  return PRIVATE_DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Next.js 16 Edge Proxy:
 * - Assigns/propagates X-Request-Id for distributed load-balanced tracing
 * - Prevents shared CDN/proxy caching of auth & account HTML routes
 * - Enforces optimistic cookie gate on private routes when ENFORCE_AUTH_GATE=true
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Strip accidental bearer tokens from URL query params on non-verification routes
  if (pathname.startsWith('/dashboard') && searchParams.has('token')) {
    const cleaned = request.nextUrl.clone();
    cleaned.searchParams.delete('token');
    return NextResponse.redirect(cleaned);
  }

  // Optional strict edge gate for full production backend deployments
  if (process.env.ENFORCE_AUTH_GATE === 'true' && isPrivateRoute(pathname)) {
    const hasSessionHint = request.cookies.get('arcadia_session_hint')?.value === '1';
    if (!hasSessionHint) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(request.headers);
  const requestId =
    requestHeaders.get('x-request-id')?.trim() || crypto.randomUUID();
  requestHeaders.set('x-request-id', requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('X-Request-Id', requestId);

  if (NO_STORE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|images/|manifest\\.json|sw\\.js).*)',
  ],
};

