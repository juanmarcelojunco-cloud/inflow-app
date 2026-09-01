import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas
  if (pathname === '/onboarding' || pathname === '/pin-lock') {
    return NextResponse.next();
  }

  // Simulación de check de sesión (en producción usar supabase.auth.getSession)
  const session = request.cookies.get('sb-access-token');

  if (!session && pathname !== '/onboarding') {
    // Si no hay sesión, redirigir al onboarding o pin-lock
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
