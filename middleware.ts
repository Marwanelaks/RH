import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const publicPaths = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no token
//   if (!token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   try {
//     // Verify token
//     jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.next();
//   } catch (error) {
//     // Clear invalid token
//     const response = NextResponse.redirect(new URL('/auth/login', request.url));
//     response.cookies.delete('auth_token');
//     return response;
//   }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};