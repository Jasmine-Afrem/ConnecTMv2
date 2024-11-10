/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/admin/roles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Middleware to check if the user is a superadmin
async function isSuperAdmin(userId: number): Promise<boolean> {
  const [rows]: [RowDataPacket[], any] = await connection.promise().query(
    'SELECT role FROM Admins WHERE user_id = ? AND role = "superadmin"',
    [userId]
  );
  return rows.length > 0;
}

// GET - Fetch all admins
export async function GET() {
  try {
    const [rows]: [RowDataPacket[], any] = await connection.promise().query(
      'SELECT a.id, a.user_id, a.role, u.username, u.email FROM Admins a JOIN Users u ON a.user_id = u.id'
    );
    return NextResponse.json({ admins: rows });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST - Add a new admin
export async function POST(request: NextRequest) {
  const { userId, role, requesterId } = await request.json();

  // Check if the requester is a superadmin
  if (!(await isSuperAdmin(requesterId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const [result] = await connection.promise().query<ResultSetHeader>(
      'INSERT INTO Admins (user_id, role) VALUES (?, ?)',
      [userId, role]
    );

    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
  }
}

// DELETE - Remove an admin
export async function DELETE(request: NextRequest) {
  const { userId, requesterId } = await request.json();

  // Check if the requester is a superadmin
  if (!(await isSuperAdmin(requesterId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connection.promise().query('DELETE FROM Admins WHERE user_id = ?', [userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json({ error: 'Failed to remove admin' }, { status: 500 });
  }
}

// PUT - Promote an admin to superadmin
export async function PUT(request: NextRequest) {
  const { userId, requesterId } = await request.json();

  // Check if the requester is a superadmin
  if (!(await isSuperAdmin(requesterId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    await connection.promise().query('UPDATE Admins SET role = "superadmin" WHERE user_id = ?', [userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error promoting admin:', error);
    return NextResponse.json({ error: 'Failed to promote admin' }, { status: 500 });
  }
}