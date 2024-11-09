// src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Type definition for the user and profile data
type UserProfile = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
};

// GET - Fetch all users with profile details
export async function GET() {
  try {
    // Fetch users from the database
    const [users] = await connection.promise().query<RowDataPacket[] & UserProfile[]>(
      `
      SELECT u.id, u.username, u.email, u.created_at, p.first_name, p.last_name, p.phone, p.address, p.bio
      FROM Users u
      LEFT JOIN Profiles p ON u.id = p.user_id
    `);

    // Ensure users is an array of UserProfile objects
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create a new user along with their profile
export async function POST(request: NextRequest) {
  try {
    const { username, email, passwordHash, firstName, lastName, phone, address, bio } = await request.json();

    // Check if the username or email already exists
    const [existingUser] = await connection.promise().query<RowDataPacket[]>(
      `
      SELECT id FROM Users WHERE username = ? OR email = ?
    `, [username, email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }

    // Insert into Users table
    const [userResult] = await connection.promise().query<ResultSetHeader>(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    // Insert into Profiles table
    await connection.promise().query(
      'INSERT INTO Profiles (user_id, first_name, last_name, phone, address, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [userResult.insertId, firstName, lastName, phone, address, bio]
    );

    return NextResponse.json({ message: 'User and profile created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT - Update a user and profile by user ID
export async function PUT(request: NextRequest) {
  try {
    const { id, username, email, firstName, lastName, phone, address, bio } = await request.json();

    // Start a transaction to ensure both User and Profile are updated together
    const connectionPromise = connection.promise();
    await connectionPromise.query('START TRANSACTION');

    // Update Users table
    await connectionPromise.query(
      'UPDATE Users SET username = ?, email = ? WHERE id = ?',
      [username, email, id]
    );

    // Update Profiles table
    await connectionPromise.query(
      'UPDATE Profiles SET first_name = ?, last_name = ?, phone = ?, address = ?, bio = ? WHERE user_id = ?',
      [firstName, lastName, phone, address, bio, id]
    );

    // Commit transaction
    await connectionPromise.query('COMMIT');

    return NextResponse.json({ message: 'User and profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete from Users (this will automatically delete the related profile because of CASCADE)
    await connection.promise().query('DELETE FROM Users WHERE id = ?', [userId]);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
