// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// src/lib/rateLimit.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function rateLimiter(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const timeWindow = 60 * 1000 // 1 minute
  const maxRequests = 100

  const currentTime = Date.now()
  const userRequests = rateLimit.get(ip) ?? []
  
  const validRequests = userRequests.filter(
    (timestamp: number) => currentTime - timestamp < timeWindow
  )
  
  if (validRequests.length >= maxRequests) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429 }
    )
  }
  
  validRequests.push(currentTime)
  rateLimit.set(ip, validRequests)
  
  return NextResponse.next()
}
