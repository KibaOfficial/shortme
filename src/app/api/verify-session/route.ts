// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { isSessionValid } from "@/lib/api";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session_token = request.cookies.get('session_token')?.value;

    if (!session_token) {
      return NextResponse.json({ message: 'No session token found' }, { status: 401 });
    }

    const response = await isSessionValid(session_token);

    if (response.status === 200) {
      Logger({ status: 'DEBUG', message: 'Session is valid'});
      return NextResponse.json({ message: "Session is valid", isValid: response.isValid }, { status: 200 });
    } else {
      return NextResponse.json({ message: response.message }, { status: response.status })
    }
  } catch (error) {
    Logger({ status: 'ERROR', message: `Error verifying session: ${error}` })
    return NextResponse.json({ message: 'An error occurred during session verification' }, { status: 500 })
  }
}