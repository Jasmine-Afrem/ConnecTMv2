import { connect, connection } from "@/dbConfig/dbConfig"; // Import the connection from your MySQL config
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Define a type for your User
interface User {
  id: number;
  email: string;
  password_hash: string;
}

// Establish database connection
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if user exists (by email)
    const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    // Cast rows to User[] manually
    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const user = users[0]; // Now TypeScript knows that `user` is of type `User`

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Return success if credentials are valid
    return NextResponse.json({
      message: "Login successful",
      success: true,
      userId: user.id, // You can return additional user details if needed
    });

  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
