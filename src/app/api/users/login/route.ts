import { connect, connection } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  email: string;
  password_hash: string;
}

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if user exists (by email)
    const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const user = users[0];
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Generate JWT token on successful login
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' } // Token expires in 2 hours
    );

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the cookie with the JWT token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60, // 2 hours in seconds
      path: '/',
    });

    return response;

  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
