/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';


export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if profile exists for the given userId
    const [rows] = await connection.promise().query<any[]>(
      'SELECT isfreelancer FROM Profiles WHERE user_id = ?',
      [userId]
    );

    const profile = rows.length > 0 ? rows[0] : null;
    console.log('Profile:', profile);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ isFreelancer: profile.isFreelancer });
  } catch (error: unknown) {
    console.error('Error fetching freelancer status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Update `isFreelancer` status for a given `userId`
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId, isFreelancer } = reqBody;

  

    // Check if profile exists for the given userId
    const [existingProfile] = await connection.promise().query<any[]>(
      'SELECT * FROM Profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update the `isFreelancer` status
    await connection.promise().query(
      'UPDATE Profiles SET isFreelancer = ? WHERE user_id = ?',
      [isFreelancer, userId]
    );

    return NextResponse.json({ message: 'Freelancer status updated successfully', success: true });
  } catch (error: unknown) {
    console.error('Error updating freelancer status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
