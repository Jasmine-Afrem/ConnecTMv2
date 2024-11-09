/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch the profile data for the user
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
    const { userId, firstName, lastName, phone, address, bio, profileImageUrl} = reqBody;

    if (!userId || !firstName || !lastName) {
      return NextResponse.json({ error: 'User ID, First Name, and Last Name are required' }, { status: 400 });
    }

    const updatedFields: any[] = [firstName, lastName, phone, address, bio, profileImageUrl];
    if (updatedFields.some((field) => typeof field === 'undefined')) {
      return NextResponse.json({ error: 'Some fields are missing or invalid' }, { status: 400 });
    }

    const [existingProfile] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length > 0) {
      
      await connection.promise().query(
        `UPDATE Profiles 
        SET first_name = ?, last_name = ?, phone = ?, address = ?, bio = ?, profile_image_url = ?, updated_at = NOW() 
        WHERE user_id = ?`,
        [firstName, lastName, phone, address, bio, profileImageUrl, userId]
      );

      return NextResponse.json({ message: 'Profile updated successfully', success: true });
    } else {
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
    const { userId, firstName, lastName, phone, address, bio, profileImageUrl } = reqBody;

    if (!userId || !firstName || !lastName) {
      return NextResponse.json({ error: 'User ID, First Name, and Last Name are required' }, { status: 400 });
    }

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
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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