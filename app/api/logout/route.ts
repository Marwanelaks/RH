import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().delete('auth_token');
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}