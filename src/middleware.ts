import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const username = request.cookies.get('inflow_user');

  // Rutas públicas
  if (pathname === '/onboarding') {
    return NextResponse.next();
  }

  // Si no hay usuario, redirigir al onboarding
  if (!username && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
