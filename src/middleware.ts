// ...existing code...
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicRoutes = [
  '/',
  '/about',
  '/artworks',
  '/forgot-password',
  '/login',
  '/privacy-policy',
  '/register',
  '/reset-password',
  '/terms-and-conditions',
  // api routes
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/session',
];

const adminRoutes = [
  '/admin-login',
  '/dashboard',
  '/inventory',
  '/notifications',
  '/orders',
  '/reports',
  '/themes',
  '/users',
];

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = isAdminRoute(pathname) ? '/admin-login' : '/login';
  const searchParams = new URLSearchParams({ callbackUrl: pathname });
  return NextResponse.redirect(new URL(`${loginUrl}?${searchParams}`, request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
  if (isPublicRoute) return NextResponse.next();

  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }
    return redirectToLogin(request, pathname);
  }

  const user = await verifyToken(token);

  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    return redirectToLogin(request, pathname);
  }

  if (isAdminRoute(pathname) && user.roleName?.toLowerCase() !== 'admin') {
    return NextResponse.redirect(new URL('/customer', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', String(user.userId));
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.roleName);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
// ...existing code...
