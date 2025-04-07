import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Allow login/register pages to be accessed without auth
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};