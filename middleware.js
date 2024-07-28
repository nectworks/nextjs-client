import { NextResponse } from 'next/server';

export function middleware(request) {
  // Simulate user authentication check
  // In a real application, you'd use a more robust method to check authentication
  const isAuthenticated = request.cookies.get('access') !== undefined;

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return NextResponse.redirect(new URL('/log-in', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Specifying which routes should be processed by this middleware
  matcher: [
    '/dashboard/job',
    '/dashboard/refer',
    '/profile/:username',
    '/feedback',
    '/account-settings',
    '/help',
  ],
};
