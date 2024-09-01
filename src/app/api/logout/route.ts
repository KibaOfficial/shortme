// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/api';
import { serialize } from 'cookie';
import Logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const session_token = request.cookies.get('session_token')?.value;

    if (!session_token) {
      return NextResponse.json({ message: 'No session token found' }, { status: 401 });
    }

    const response = await logout(session_token);

    if (response.status === 200) {
      const headers = new Headers();
      headers.append(
        'Set-Cookie',
        serialize("session_token", '', {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          sameSite: "strict",
          path: "/",
        })
      );

      return NextResponse.json({ message: 'Logout successful' }, { headers });
    } else {
      return NextResponse.json({ message: response.message }, { status: response.status });
    }
  } catch (error) {
    Logger({ status: 'ERROR', message: `Error logging out: ${error}` });
    return NextResponse.json({ message: 'An error occurred while logging out' }, { status: 500 });
  }
}
