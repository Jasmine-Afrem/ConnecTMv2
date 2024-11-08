// app/api/protected/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Protected route accessed successfully!',
    success: true,
  });
}
