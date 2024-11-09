/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connection } from '@/dbConfig/dbConfig';
import brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);
const fromEmail = process.env.BREVO_FROM_EMAIL;
const baseUrl = process.env.BASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!process.env.BREVO_API_KEY || !fromEmail || !baseUrl || !jwtSecret) {
  throw new Error('One or more environment variables are not defined');
}

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.BASE_URL}/api/verify-email?token=${token}`;

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = "Verify your email address";
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Welcome to Our App!</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      </body>
    </html>
  `;
  sendSmtpEmail.sender = { "name": "YourApp", "email": process.env.BREVO_FROM_EMAIL };
  sendSmtpEmail.to = [{ "email": to }];
  if (!process.env.BREVO_FROM_EMAIL) {
    throw new Error('BREVO_FROM_EMAIL environment variable is not defined');
  }
  sendSmtpEmail.replyTo = { "email": process.env.BREVO_FROM_EMAIL, "name": "YourApp Support" };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Verification email sent successfully');
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

    // Insert a new profile for the user
    console.log('Inserting new profile for user ID:', userId);
    await connection.promise().query(
      'INSERT INTO Profiles (user_id) VALUES (?)',
      [userId]
    );
    console.log('Profile created successfully for user ID:', userId);

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
