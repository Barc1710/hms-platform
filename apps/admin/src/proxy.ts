import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Decodifica de forma segura el payload de un JWT en formato base64url sin verificar firma (apto para Edge runtime).
 */
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Excluir rutas de autenticación y recursos estáticos
  const isAuthPath = pathname === '/login' || pathname === '/forgot-password' || pathname === '/reset-password';
  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.');

  if (isAuthPath || isStaticAsset) {
    return NextResponse.next();
  }

  // 2. Extraer y verificar el token de sesión
  const token = request.cookies.get('hms_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = decodeJwt(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('hms_session');
    return response;
  }

  // 3. Extraer el subdominio de la URL actual
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');

  let subdomain = '';
  if (parts.length > 2) {
    subdomain = parts[0];
  } else if (parts.length === 2 && parts[1] === 'localhost') {
    subdomain = parts[0];
  }

  // 4. Regla de escape para desarrollo visual
  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_TENANT_MATCH === 'true';

  if (!devBypass && subdomain) {
    const isMatch = subdomain === payload.slug || subdomain === payload.hotelId;
    if (!isMatch) {
      // Si no coincide el subdominio con el tenant del token, redirige a login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
export { middleware as proxy };
