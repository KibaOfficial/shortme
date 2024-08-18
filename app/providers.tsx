// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use client'
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode}) {
    return (
        <ThemeProvider defaultTheme="dark" enableSystem>
            {children}
        </ThemeProvider>
    )
}