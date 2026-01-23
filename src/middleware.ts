import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { isAdmin } from '@/lib/role';
import { matchesRoute } from '@/lib/paths';

const publicRoutes = [
  '/',
  '/about',
  '/artworks',
  '/artists',
  '/forgot-password',
  '/login',
  '/privacy-policy',
  '/register',
  '/reset-password',
  '/terms-of-use',
  '/verify-email',
  '/settings',
  '/themes', // todo: remove later
  '/faq',
  // api routes
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/session',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/artworks/:id/available-date',
  '/api/event',
  '/api/session',
  '/api/webhooks',
];

const adminRoutes = [
  '/admin',
  '/login',
  '/dashboard',
  '/calendar',
  '/inventory',
  '/notifications',
  '/orders',
  '/reports',
  // '/themes',
  '/users',
];

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = '/login';
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

  const isPublicRoute = publicRoutes.some((route) => matchesRoute(pathname, route));
  if (isPublicRoute) return NextResponse.next();

  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }
    return redirectToLogin(request, pathname);
  }

  const user = await verifyToken(token);

  if (!user) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    return redirectToLogin(request, pathname);
  }

  if (isAdminRoute(pathname) && !isAdmin(user)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdmin(user) && !isAdminRoute(pathname) && !isApiRoute(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
