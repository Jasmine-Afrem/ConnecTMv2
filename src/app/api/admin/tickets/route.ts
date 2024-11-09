// src/app/api/admin/tickets/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/dbConfig/dbConfig';

// GET all tasks (tickets)
export async function GET() {
  try {
    const [tasks] = await connection.promise().query(`
      SELECT id, user_id, title, description, status, points, created_at 
      FROM Tasks
    `);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// PUT - update task status or other details by task ID
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, status, points } = await request.json();

    await connection.promise().query(
      'UPDATE Tasks SET title = ?, description = ?, status = ?, points = ? WHERE id = ?',
      [title, description, status, points, id]
    );

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - delete a task by ID
export async function DELETE(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('id');
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await connection.promise().query('DELETE FROM Tasks WHERE id = ?', [taskId]);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
