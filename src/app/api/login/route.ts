// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Libs
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

// components
import Logger from "@/lib/logger";
import { login } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    Logger({
      status: "INFO",
      message: `Request data: ${JSON.stringify({ username, password })}`,
    });

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const response = await login(username, password);

    if (response.status === 200) {
      if (response.token) {
        const headers = new Headers();
        headers.append(
          "Set-Cookie",
          serialize("session_token", response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict",
            path: "/",
          })
        );

        return NextResponse.json({ message: "Login successful" }, { headers });
      } else {
        return NextResponse.json(
          { message: "Login successful, but no token received" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: response.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { message: "An error occurred while logging in" },
      { status: 500 }
    );
  }
}
