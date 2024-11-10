import { connection } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

// Add Applicant
export async function POST(request: NextRequest) {
  try {
    const { task_id, user_id, message } = await request.json();

    const [result] = await connection.promise().query(
      'INSERT INTO Appliers (task_id, user_id, message) VALUES (?, ?, ?)',
      [task_id, user_id, message]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

// Remove Applicant
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await connection.promise().query('DELETE FROM Appliers WHERE id = ?', [id]);

    return NextResponse.json({ message: "Applicant removed successfully" }, { status: 204 });
  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

// Accept Applicant
export async function PUT(request: NextRequest) {
  try {
    const { task_id, user_id } = await request.json();

    await connection.promise().beginTransaction();

    await connection.promise().query(
      'UPDATE Tasks SET selected_applicant_id = ? WHERE id = ?',
      [user_id, task_id]
    );

    await connection.promise().query(
      'DELETE FROM Appliers WHERE task_id = ? AND user_id != ?',
      [task_id, user_id]
    );

    await connection.promise().commit();

    return NextResponse.json({ message: "Applicant accepted successfully" }, { status: 200 });
  } catch (error: unknown) {
    await connection.promise().rollback();
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}