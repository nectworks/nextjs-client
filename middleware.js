import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Set cache headers for favicon files
  if (pathname.includes('/favicon/')) {
    const response = NextResponse.next();
    // Cache favicon files for 7 days (604800 seconds)
    response.headers.set('Cache-Control', 'public, max-age=604800, immutable');
    return response;
  }

  // Authentication middleware for protected routes
  // Check if the current path requires authentication
  const requiresAuth = [
    '/dashboard/job',
    '/dashboard/refer',
    '/profile',
    '/feedback',
    '/account-settings',
    '/help',
  ].some(path => pathname.startsWith(path));

  if (requiresAuth) {
    // Simulate user authentication check
    // In a real application, you'd use a more robust method to check authentication
    const isAuthenticated = request.cookies.get('access') !== undefined;

    if (!isAuthenticated) {
      // If user is not authenticated, redirect to login page
      return NextResponse.redirect(new URL('/log-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Specifying which routes should be processed by this middleware
  matcher: [
    // Auth protected routes
    '/dashboard/job',
    '/dashboard/refer',
    '/profile/:username',
    '/feedback',
    '/account-settings',
    '/help',
    // Favicon routes
    '/favicon/:path*',
  ],
};