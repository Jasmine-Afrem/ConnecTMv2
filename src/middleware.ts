import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  matcher: '/api/protected/:path*',
};

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication token missing.' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT secret is missing.' }, { status: 500 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    console.log('Decoded token:', payload);
    return NextResponse.next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: `Token verification failed: ${error.message}` }, { status: 403 });
    }
    return NextResponse.json({ message: 'Unknown error occurred during token verification.' }, { status: 403 });
  }
}
