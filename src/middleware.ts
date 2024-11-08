// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Extract the JWT token from the "token" cookie
  const token = request.cookies.get('token')?.value;

  // If the token is missing, return a 401 Unauthorized response
  if (!token) {
    return NextResponse.json(
      { message: 'Authentication token missing. Please log in.' },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token using the secret from environment variables
    jwt.verify(token, process.env.JWT_SECRET as string);

    // If token verification is successful, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, return a 403 Forbidden response
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { message: 'Invalid or expired token. Please log in again.' },
      { status: 403 }
    );
  }
}

// Config: Apply this middleware only to specific routes
export const config = {
  matcher: '/api/protected/:path*', // Adjust this to the routes you want to protect
};
