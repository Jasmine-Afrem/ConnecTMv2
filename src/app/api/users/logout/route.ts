import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Set the cookie with an expired token to clear it
    response.headers.set(
      'Set-Cookie',
      `token=; HttpOnly; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}; Max-Age=0; Path=/`
    );

    return response;
  } catch (error: unknown) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
