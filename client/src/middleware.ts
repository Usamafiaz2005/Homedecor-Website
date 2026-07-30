import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');
  const isProtectedRoute = path.startsWith('/profile') || path.startsWith('/checkout');
  const isAdminRoute = path.startsWith('/admin');

  // If user has tokens and tries to access login/register, redirect to home
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user lacks tokens and tries to access protected routes, redirect to login
  if (!refreshToken && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/profile/:path*', '/checkout/:path*', '/admin/:path*'],
};