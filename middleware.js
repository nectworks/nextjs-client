import { NextResponse } from 'next/server';

export function middleware(request) {
  // Simulate user authentication check
  // In a real application, you'd use a more robust method to check authentication
  const isAuthenticated = request.cookies.get('access') !== undefined;

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page and preserve destination.
    const loginUrl = new URL('/log-in', request.url);
    const redirectPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set('redirect', redirectPath);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Specifying which routes should be processed by this middleware
  matcher: [
    '/dashboard/job',
    '/dashboard/refer',
    '/profile',
    '/profile/:username',
    '/feedback',
    '/account-settings',
    '/help',
    '/nectcoins',
  ],
};
