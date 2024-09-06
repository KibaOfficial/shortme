// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { deleteCode } from "@/lib/api";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    Logger({ status: "DEBUG", message: `Code to delete is: ${code}`})

    if (!code) {
      Logger({ status: "ERROR", message: "No code provided"})
      return NextResponse.json({ message: "No code provided" }, { status: 400 })
    }

    const response = await deleteCode(code);

    if (response.status === 200) {
      Logger({ status: "INFO", message: "Code deleted successfully"})
      return NextResponse.json({ message: "Code deleted successfully" }, { status: 200 })
    }

    if (response.status === 404) {
      Logger({ status: "WARN", message: "Code not found"})
      return NextResponse.json({ message: "Code not found" }, { status: 404 })
    }

    return NextResponse.json({ message: response.message }, { status: response.status })
  } catch (err) {
    Logger({ status: "ERROR", message: `An error occurred: ${err}` })
    return NextResponse.json({ message: "An error occurred" }, { status: 500 })
  }
}
