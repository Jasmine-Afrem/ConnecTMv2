import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connection } from '@/dbConfig/dbConfig';

// Function to extract userId from JWT cookie
const getUserIdFromCookie = (request: NextRequest): number | null => {
  const token = request.cookies.get('token')?.value; // Access the cookie's value directly
  if (!token) {
    return null; // Return null if token is not present
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Cast decoded to `unknown` first, then to `{ userId: number }` to access userId
    const decodedToken = decoded as unknown;

    // Safely check for the presence of userId and return it
    if (typeof decodedToken === 'object' && decodedToken !== null && 'userId' in decodedToken) {
      return (decodedToken as { userId: number }).userId;
    } else {
      return null; // Return null if userId is not found
    }
  } catch (err) {
    console.error('Invalid token', err);
    return null; // Return null if token verification fails
  }
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request); // Get userId from the JWT cookie

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 }); // If no userId, return unauthorized
    }

    // Fetch the profile for the user
    const [rows] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    const profile = rows.length > 0 ? rows[0] : null;

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });

  } catch (error: unknown) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { firstName, lastName, phone, address, bio, profileImageUrl } = reqBody;

    const userId = getUserIdFromCookie(request); // Get userId from JWT cookie

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 }); // Return unauthorized if no userId
    }

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First Name and Last Name are required' }, { status: 400 });
    }

    const updatedFields: any[] = [firstName, lastName, phone, address, bio, profileImageUrl];
    if (updatedFields.some((field) => typeof field === 'undefined')) {
      return NextResponse.json({ error: 'Some fields are missing or invalid' }, { status: 400 });
    }

    // Check if the profile already exists
    const [existingProfile] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length > 0) {
      // Update the existing profile
      await connection.promise().query(
        `UPDATE Profiles 
        SET first_name = ?, last_name = ?, phone = ?, address = ?, bio = ?, profile_image_url = ?, updated_at = NOW() 
        WHERE user_id = ?`,
        [firstName, lastName, phone, address, bio, profileImageUrl, userId]
      );

      return NextResponse.json({ message: 'Profile updated successfully', success: true });
    } else {
      // Insert a new profile
      await connection.promise().query(
        `INSERT INTO Profiles (user_id, first_name, last_name, phone, address, bio, profile_image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, firstName, lastName, phone, address, bio, profileImageUrl]
      );

      return NextResponse.json({ message: 'Profile created successfully', success: true });
    }

  } catch (error: unknown) {
    console.error('Error posting profile data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT handler to update the profile
export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { firstName, lastName, phone, address, bio, profileImageUrl } = reqBody;

    const userId = getUserIdFromCookie(request); // Get userId from JWT cookie

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First Name and Last Name are required' }, { status: 400 });
    }

    // Check if profile exists
    const [existingProfile] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update the profile
    await connection.promise().query(
      `UPDATE Profiles 
      SET first_name = ?, last_name = ?, phone = ?, address = ?, bio = ?, profile_image_url = ?, updated_at = NOW() 
      WHERE user_id = ?`,
      [firstName, lastName, phone, address, bio, profileImageUrl, userId]
    );

    return NextResponse.json({ message: 'Profile updated successfully', success: true });

  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE handler to delete the profile
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request); // Get userId from JWT cookie

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Check if the profile exists
    const [existingProfile] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Delete the profile
    await connection.promise().query(
      'DELETE FROM Profiles WHERE user_id = ?',
      [userId]
    );

    return NextResponse.json({ message: 'Profile deleted successfully', success: true });

  } catch (error: unknown) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
