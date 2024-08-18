// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import { getUserBySessionToken, validateSession } from '@/utils/api';

const DashboardPage: React.FC = () => {
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = cookies.get('session_token');
        console.log("Checking session with token:", token);

        if (!token) {
          console.error("No token found.");
          setIsSessionValid(false);
          router.push("/auth");
          return;
        }

        const username = await getUserBySessionToken(token);
        console.log("Username from session token:", username);

        if (username === null) {
          console.log("Session invalid, redirecting to /auth");
          setIsSessionValid(false);
          router.push("/auth");
        } else {
          const valid = await validateSession(username, token);
          console.log("Session validation result:", valid);

          setIsSessionValid(valid);

          if (!valid) {
            console.log("Session not valid, redirecting to /auth");
            router.push("/auth");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsSessionValid(false);
        router.push("/auth");
      }
    };

    checkSession();
  }, [router, cookies]);

  if (isSessionValid === null) {
    return <div>Loading...</div>;
  }

  if (!isSessionValid) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">ShortMe</h1>
        <p className="text-lg text-gray-300">The Dashboard you&apos;re looking for is currently a work in progress.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
