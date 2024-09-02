// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createShort, getSessionCookie, getUserIdBySessionToken } from "@/lib/api";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, origin } = await request.json();
    const token = request.cookies.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ message: "Missing session cookie" }, { status: 401 });
    }

    const { id: user_id } = await getUserIdBySessionToken(token);

    Logger({
      status: "INFO",
      message: `Request data: ${JSON.stringify({ code, origin, user_id })}`,
    });

    if (!code) {
      return NextResponse.json({ message: "Missing code parameter" }, { status: 400 });
    }
    if (!origin) {
      return NextResponse.json({ message: "Missing origin parameter" }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ message: "Missing user_id parameter" }, { status: 400 });
    }

    const result = await createShort(code, origin, user_id);

    if (result.status === 409) {
      return NextResponse.json({ message: result.message }, { status: 409 });
    }

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    Logger({
      status: "ERROR",
      message: `Error in create-short route: ${error}`,
    });
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}