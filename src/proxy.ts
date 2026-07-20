import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // If the user is trying to access a dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      // No token at all -> redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode the JWT payload (Base64Url decode)
      // A JWT looks like header.payload.signature
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        throw new Error("Invalid token format");
      }

      // Base64Url decode
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);

      // Check expiration timestamp (in seconds)
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        // Token is expired -> redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        
        // Optionally clear the expired cookie so we don't send it again
        response.cookies.delete('access_token');
        
        return response;
      }
    } catch (e) {
      // If token parsing fails (malformed token), redirect to login
      console.error("Failed to parse token in proxy:", e);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      return response;
    }
  }

  // Allow the request to proceed if valid or not on a protected route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
