import { connect, connection } from "@/dbConfig/dbConfig"; // Import the connection from your MySQL config
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Establish database connection
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);

    // Check if user already exists (by email)
    const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Insert new user into the database
    const [result] = await connection.promise().query(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    console.log(result);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
    });

  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}


