/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { connection } from '@/dbConfig/dbConfig';

// Set up the transporter for nodemailer using EMAIL_SERVER from environment variables
const emailServer = process.env.EMAIL_SERVER as string;
const [smtpUser, smtpPass, smtpHost] = emailServer
  .replace('smtp://', '')
  .split(':')
  .map((part) => decodeURIComponent(part));  // Decode in case of any encoded characters like '@'

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: 465,
  secure: true, // Use SSL for Gmail
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Function to send the verification email
const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const url = `${process.env.BASE_URL}/api/verify-email?token=${token}`;
  const mailOptions = {
    from: smtpUser, // Use the configured sender email from EMAIL_SERVER
    to,
    subject: 'Please verify your email address',
    html: `<p>Click the link below to verify your email address:</p><a href="${url}">${url}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

// POST handler for user signup
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check if the user already exists
    const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Insert new user into the database
    const [result] = await connection.promise().query(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const userId = (result as any).insertId;  // Extract the new user's ID

    // Generate JWT for email verification
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Send the email with the verification token
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: 'User created successfully. Please verify your email.',
      success: true,
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
