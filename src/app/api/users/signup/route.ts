/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import emailjs from 'emailjs-com';
import jwt from 'jsonwebtoken';
import { connection } from '@/dbConfig/dbConfig';
import fetch from 'node-fetch';

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.BASE_URL}/api/verify-email?token=${token}`;
  const templateParams = {
    to_email: to,
    verification_url: verificationUrl,
  };

  try {
    console.log('Attempting to send verification email to:', to);
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID as string,
      process.env.EMAILJS_TEMPLATE_ID as string,
      templateParams,
      process.env.EMAILJS_PUBLIC_KEY as string
    );
    console.log('Verification email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('Received request:', request);
    
    // Parse the request body
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log('Parsed request body:', reqBody);

    // Validate input
    if (!username || !email || !password) {
      console.error('Validation error: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user already exists
    console.log('Checking if user already exists in the database for email:', email);
    const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (Array.isArray(rows) && rows.length > 0) {
      console.error('User already exists with email:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    console.log('No existing user found with email:', email);

    // Hash the password
    console.log('Hashing password for user:', username);
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log('Password hashed successfully for user:', username);

    // Insert new user into the database
    console.log('Inserting new user into database:', { username, email });
    const [result] = await connection.promise().query(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const userId = (result as any).insertId;
    console.log('User created with ID:', userId);

    // Generate JWT for email verification
    console.log('Generating JWT for email verification for user ID:', userId);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    console.log('JWT generated successfully');

    // Send the email with the verification token
    console.log('Sending verification email to:', email);
    await sendVerificationEmail(email, token);

    console.log('User created and verification email sent successfully');
    return NextResponse.json({
      message: 'User created successfully. Please verify your email.',
      success: true,
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
