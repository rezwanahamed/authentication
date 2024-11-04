import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export function authMiddleware(request: NextRequestWithAuth) {
  return withAuth(request, {
    callbacks: {
      authorized: ({ token }) => {
        return !!token?.accessToken;
      },
    },
    pages: {
      signIn: '/login',
      error: '/auth/error',
    },
  });
}