// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getLinkByCode } from "@/lib/api";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    Logger({
      status: "INFO",
      message: `Request Link for code: ${code}`,
    });

    if (!code) {
      return NextResponse.json({ message: "Code not found" }, { status: 404 });
    }

    const response = await getLinkByCode(code);

    if (response.status === 500) {
      return NextResponse.json(
        { message: response.message },
        { status: response.status }
      );
    } else if (response.status === 404) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    } else {
      const link = response.origin?.toString();
      return NextResponse.json({
        message: "Link found",
        status: 200,
        link: link,
      });
    }
  } catch (err) {
    Logger({
      status: "ERROR",
      message: `Error in getLink API route: ${err}`,
    });
    return NextResponse.json({ message: "Unexpected error", status: 500 });
  }
}
