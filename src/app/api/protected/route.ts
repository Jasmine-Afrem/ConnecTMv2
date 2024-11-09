import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication token missing.' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT secret is missing.' }, { status: 500 });
    }

    // Verify and decode the JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    console.log('Decoded token:', payload);

    // Assuming the payload contains `userId` and `email` fields
    const { userId, email } = payload;

    return NextResponse.json({
      message: 'Protected route accessed successfully!',
      success: true,
      userId: userId,
      email: email,  // Include email in the response
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: `Token verification failed: ${error.message}` }, { status: 403 });
    }
    return NextResponse.json({ message: 'Unknown error occurred during token verification.' }, { status: 403 });
  }
}
