import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connection } from '@/dbConfig/dbConfig';
import { Resend } from 'resend';

// Hardcode the API key (temporarily)
const resend = new Resend('re_Cv9aTEGm_AyKP2ByrAFERsvGBAQv5ZHoa');
const jwtSecret = process.env.JWT_SECRET;

interface User {
  username: string;
  email: string;
  password_hash: string;
}

interface Profile {
  user_id: number;
}

async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `http://localhost:3000/api/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'admin@scof.live',
      to: email,
      subject: 'Verify Your Email!',
      html: `<p>Welcome to n0exp!</p>
        <p>Please confirm your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>`
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

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

    const userId = (result as unknown as { insertId: number }).insertId;
    console.log('User created with ID:', userId);

    // Create a new Profile object
    const profile: Profile = { user_id: userId };

    // Insert a new profile for the user
    console.log('Inserting new profile for user ID:', userId);
    await connection.promise().query(
      'INSERT INTO Profiles SET ?',
      { ...profile }
    );
    console.log('Profile created successfully for user ID:', userId);

    // Generate JWT for email verification
    console.log('Generating JWT for email verification for user ID:', userId);
    const token = jwt.sign({ userId }, jwtSecret as string, { expiresIn: '1h' });
    console.log('JWT generated successfully');

    // Send the email with the verification token
    console.log('Sending verification email to:', email);
    await sendVerificationEmail(email, token);

    // Create a User object based on the inserted data
    const newUser: User = {
      username: username,
      email: email,
      password_hash: hashedPassword
    };

    console.log('New User object created:', newUser);

    console.log('User created and verification email sent successfully');
    return NextResponse.json({
      message: 'User created successfully. Please verify your email.',
      success: true,
      newUser: newUser
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
