import { connect, connection } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connect();

export async function GET(request: NextRequest) {
  try {
    // Extract userId from request headers, query parameters, or body
    const userId = request.headers.get("userId") || request.url.split('?')[1]?.split('=')[1];

    // Ensure the userId is provided
    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    // Fetch the user data from the database (Users table)
    const [rows] = await connection.promise().query('SELECT id, email, username FROM Users WHERE id = ?', [userId]);

    const users = rows as { id: number; email: string; username: string }[];

    // If user is not found, return an error
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data (without password)
    const user = users[0];
    return NextResponse.json({ success: true, user });

  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
