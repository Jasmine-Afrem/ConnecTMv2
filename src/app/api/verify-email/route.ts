import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';  // JWT library for verifying token
import { connection } from '@/dbConfig/dbConfig';  // Assuming dbConfig is already set up

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');  // Get the token from query params

  if (!token) {
    return NextResponse.json({
      message: 'Invalid or missing token.',
      success: false,
    }, { status: 400 });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // Extract user ID from the decoded token
    const userId = decoded.userId;

    // Look for the user with the given user ID
    const [userRows] = await connection.promise().query('SELECT * FROM Users WHERE id = ?', [userId]);

    if (Array.isArray(userRows) && userRows.length > 0) {
      // The user exists, now mark the user as verified
      await connection.promise().query('UPDATE Users SET is_verified = 1 WHERE id = ?', [userId]);

      return NextResponse.json({
        message: 'Your email has been successfully verified!',
        success: true,
      });
    } else {
      return NextResponse.json({
        message: 'User not found.',
        success: false,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({
      message: 'Invalid or expired token.',
      success: false,
    }, { status: 400 });
  }
}
