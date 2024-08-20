'use client';

import { ThemeProvider } from 'next-themes';
import { CookiesProvider } from 'next-client-cookies/server';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <ThemeProvider defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </CookiesProvider>
  );
}
