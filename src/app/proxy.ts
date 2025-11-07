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
  // API routes
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout'
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
  return adminRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = isAdminRoute(pathname) ? '/admin-login' : '/login';
  // Store the original URL to redirect after login
  const searchParams = new URLSearchParams({
    callbackUrl: pathname,
  });
  return NextResponse.redirect(new URL(`${loginUrl}?${searchParams}`, request.url));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return redirectToLogin(request, pathname);
  }
  
  // Verify token
  const user = verifyToken(token);
  if (!user) {
    return redirectToLogin(request, pathname);
  }
  
  // Check role-based access
  if (isAdminRoute(pathname)) {
    if (user.roleName?.toLowerCase() !== 'admin') {
      // Redirect non-admin users to customer area
      return NextResponse.redirect(new URL('/customer', request.url));
    }
  } else if (pathname.startsWith('/customer')) {
    // Customer routes require authentication but allow any authenticated user
    // Admin users can access customer routes too
    if (!user) {
      return redirectToLogin(request, pathname);
    }
  }
  
  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId.toString());
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.roleName);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};