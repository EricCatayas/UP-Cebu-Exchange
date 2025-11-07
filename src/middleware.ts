import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/auth';

// Define protected routes and their required roles
const protectedRoutes = {
  admin: ['/admin'],
  customer: ['/customer'],
  authenticated: ['/api/auth/session'] // Routes that require any authenticated user
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/customer/auth/login',
  '/customer/auth/register',
  '/customer/auth/forgot-password',
  '/customer/auth/reset-password',
  '/customer/artworks',
  '/customer/about',
  '/customer/privacy-policy',
  '/customer/terms-and-conditions',
  '/admin/auth/login'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes (except auth), and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  // Check if route is public
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
  if (pathname.startsWith('/admin')) {
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

function redirectToLogin(request: NextRequest, pathname: string) {
  const isAdminRoute = pathname.startsWith('/admin');
  const loginUrl = isAdminRoute ? '/admin/auth/login' : '/customer/auth/login';
  
  // Store the original URL to redirect after login
  const redirectUrl = new URL(loginUrl, request.url);
  redirectUrl.searchParams.set('callbackUrl', pathname);
  
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};