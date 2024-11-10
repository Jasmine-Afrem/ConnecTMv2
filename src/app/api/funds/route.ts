// src/app/api/funds/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Middleware to check if the user exists
async function userExists(userId: number): Promise<boolean> {
  const [rows]: [RowDataPacket[], any] = await connection.promise().query(
    'SELECT id FROM Users WHERE id = ?',
    [userId]
  );
  return rows.length > 0;
}

// GET - Check funds for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [rows]: [RowDataPacket[], any] = await connection.promise().query(
      'SELECT points FROM Points WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ points: rows[0].points });
  } catch (error) {
    console.error('Error checking funds:', error);
    return NextResponse.json({ error: 'Failed to check funds' }, { status: 500 });
  }
}

// POST - Add funds to a user account
export async function POST(request: NextRequest) {
  const { userId, amount } = await request.json();

  if (!userId || !amount) {
    return NextResponse.json({ error: 'User ID and amount are required' }, { status: 400 });
  }

  if (!(await userExists(userId))) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    await connection.promise().query(
      'INSERT INTO Points (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = points + VALUES(points)',
      [userId, amount]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding funds:', error);
    return NextResponse.json({ error: 'Failed to add funds' }, { status: 500 });
  }
}

// PUT - Decrease funds from a user account
export async function PUT(request: NextRequest) {
  const { userId, amount } = await request.json();

  if (!userId || !amount) {
    return NextResponse.json({ error: 'User ID and amount are required' }, { status: 400 });
  }

  if (!(await userExists(userId))) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const [rows]: [RowDataPacket[], any] = await connection.promise().query(
      'SELECT points FROM Points WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0 || rows[0].points < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    await connection.promise().query(
      'UPDATE Points SET points = points - ? WHERE user_id = ?',
      [amount, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error decreasing funds:', error);
    return NextResponse.json({ error: 'Failed to decrease funds' }, { status: 500 });
  }
}