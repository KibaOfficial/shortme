// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// src/lib/validation.ts
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateCode(code: string): boolean {
  const codeRegex = /^[a-zA-Z0-9-_]{4,}$/
  return codeRegex.test(code)
}
