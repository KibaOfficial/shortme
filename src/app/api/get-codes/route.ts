// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getCodesForUserId, getUserIdBySessionToken } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import Logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const session_token = request.cookies.get('session_token')?.value;
    if (!session_token) {
      Logger({ status: 'WARN', message: 'No session token found' });
      return NextResponse.json({ message: 'No session token found' }, { status: 401 });
    }

    const userIdResponse = await getUserIdBySessionToken(session_token);

    if (userIdResponse.status !== 200 || !userIdResponse.id) {
      Logger({ status: 'WARN', message: 'Invalid session token' });
      return NextResponse.json({ status: 401, message: 'Invalid session token' });
    }

    const result = await getCodesForUserId(userIdResponse.id);

    if (result.status !== 200) {
      Logger({ status: 'ERROR', message: `Failed to fetch links: ${result.message}` });
      return NextResponse.json({ status: result.status, message: result.message });
    }

    Logger({ status: 'INFO', message: 'Links successfully retrieved' });
    return NextResponse.json({ status: 200, message: "Links Found", links: result.links });
  } catch (err) {
    Logger({ status: 'ERROR', message: `Error in POST /api/getCodes: ${err}` });
    return NextResponse.json({ status: 500, message: 'Unexpected error' });
  }
}
