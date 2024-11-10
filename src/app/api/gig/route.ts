/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';

// GET handler to fetch gigs
export async function GET(request: NextRequest) {
  try {
    const gigId = request.nextUrl.searchParams.get('id');
    const userId = request.nextUrl.searchParams.get('user_Id');

    let query = 'SELECT * FROM Tasks';
    const params: any[] = [];

    // Fetch a specific gig by gigId if provided
    if (gigId) {
      query += ' WHERE id = ?';
      params.push(gigId);
    }
    // Fetch gigs by userId if provided
    else if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    // Execute the query
    const [rows] = await connection.promise().query<any[]>(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No gigs found', gigs: [] }, { status: 404 });
    }

    return NextResponse.json({ gigs: rows }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler to create a new gig
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      userId,
      title,
      description,
      points,
      location,
      category,
      city
    } = reqBody;

    // Validate required fields
    if (!userId || !title || !description || !points) {
      return NextResponse.json(
        { error: 'User ID, Title, Description, and Points are required' },
        { status: 400 }
      );
    }

    // Insert the new gig into the database
    await connection.promise().query(
      `INSERT INTO Tasks (user_id, title, description, points, location, category, city) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, points, location, category, city]
    );

    return NextResponse.json({ message: 'Gig created successfully', success: true });
  } catch (error: unknown) {
    console.error('Error creating gig:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT handler to update the gig
export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      gigId,
      userId,
      title,
      description,
      points,
      location,
      category,
      city
    } = reqBody;

    if (!gigId || !userId || !title || !description || !points ||!location ||!category ||!city) {
      return NextResponse.json({ error: 'All * fields are required' }, { status: 400 });
    }

    // Check if the gig exists
    const [existingGig] = await connection.promise().query<any[]>(
      'SELECT * FROM Tasks WHERE id = ? AND user_id = ?',
      [gigId, userId]
    );

    if (existingGig.length === 0) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Update the gig
    await connection.promise().query(
      `UPDATE Tasks 
      SET title = ?, description = ?, points = ?, location = ?, category = ?, city = ?, updated_at = NOW() 
      WHERE id = ? AND user_id = ?`,
      [title, description, points, location, category, city, gigId, userId]
    );

    return NextResponse.json({ message: 'Gig updated successfully', success: true });

  } catch (error: unknown) {
    console.error('Error updating gig:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE handler to delete the gig
export async function DELETE(request: NextRequest) {
  try {
    const gigId = request.nextUrl.searchParams.get('id');
    const userId = request.nextUrl.searchParams.get('user_Id');

    if (!gigId || !userId) {
      return NextResponse.json({ error: 'Gig ID and User ID are required' }, { status: 400 });
    }

    // Check if the gig exists
    const [existingGig] = await connection.promise().query<any[]>(
      'SELECT * FROM Tasks WHERE id = ? AND user_id = ?',
      [gigId, userId]
    );

    if (existingGig.length === 0) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Delete the gig
    await connection.promise().query(
      'DELETE FROM Tasks WHERE id = ? AND user_id = ?',
      [gigId, userId]
    );

    return NextResponse.json({ message: 'Gig deleted successfully', success: true });

  } catch (error: unknown) {
    console.error('Error deleting gig:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
