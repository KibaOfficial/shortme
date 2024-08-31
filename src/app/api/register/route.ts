// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from 'next/server';
import { Register } from '@/lib/api';


export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    const response = await Register(username, password);

    if (response.status === 201) {
      return NextResponse.json({ message: 'User registered successfully' });
    } else {
      return NextResponse.json({ message: response.message }, { status: response.status });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred while registering the user' }, { status: 500 });
  }
}
