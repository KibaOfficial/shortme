// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// src/lib/config.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_HOSTNAME: z.string().url(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  DEBUG: z.string().transform(str => str === 'true')
})

export const env = envSchema.parse(process.env)
