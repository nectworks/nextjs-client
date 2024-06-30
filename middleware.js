import { NextResponse } from 'next/server';

export function middleware(request) {
  // Simulate user authentication check
  // In a real application, you'd use a more robust method to check authentication
  const isAuthenticated = request.cookies.get('access') !== undefined;
  console.log(` isAuthenticated: ${isAuthenticated}`);
  // Check if the route requires professional status
  // const requireProfessional = request.nextUrl.pathname.startsWith('/professional');
  // console.log(` requireProfessional: ${requireProfessional}`);
  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  // if (requireProfessional) {
  //   // Simulate checking if user is a professional
  //   // In a real application, you'd use a more robust method to check user type
  //   const isProfessional = request.cookies.get('user_type') === 'professional';
  //   console.log(` isProfessional: ${isProfessional}`);
  //   if (!isProfessional) {
  //     // If route requires professional status but user is not a professional,
  //     // redirect to account settings with a message
  //     return NextResponse.redirect(
  //       new URL('/account-settings', request.url)
  //     );
  //   }
  // }
  // If all checks pass, allow the request to proceed
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
