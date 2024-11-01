// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isSessionValid } from './api'

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')
  
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
    
    const session = await isSessionValid(sessionToken.value)
    if (!session.isValid) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  return NextResponse.next()
}