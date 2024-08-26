'use client';

import React from 'react';
import { setCookie, getCookie, removeCookie } from '@/lib/cookies';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}
