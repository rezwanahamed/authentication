import { NextRequest, NextResponse } from 'next/server';

import { registerMiddleware } from './middlewares/registerMiddleware';
import { authMiddleware } from './middlewares/authMiddleware';

export function middleware(request: NextRequest) {
  // Run authMiddleware first
  const authResponse = authMiddleware(request);
  if (authResponse) {
    return authResponse; // Stop if authMiddleware returns a response
  }

  // Run registerMiddleware next
  const registerResponse = registerMiddleware(request);
  if (registerResponse) {
    return registerResponse; // Stop if registerMiddleware returns a response
  }

  // If neither middleware returned a response, proceed
  return NextResponse.next();
}

// Configure which paths this middleware will run on (combined from both configs)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/details/:path*',
    '/register',
    '/user-additional-details',
    '/password',
    '/otp'
  ],
};
