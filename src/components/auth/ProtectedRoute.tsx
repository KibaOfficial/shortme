// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isSessionValidState, setIsSessionValidState] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', { method: 'POST' });
        const data = await response.json();

        if (response.status === 200 && data.isValid) {
          setIsSessionValidState(true);
        } else {
          setIsSessionValidState(false);
          router.push('/auth');
        }
      } catch (err) {
        console.error("Error verifying session:", err);
        setIsSessionValidState(false);
        router.push('/auth');
      }
    };

    verifySession();
  }, [router]);

  if (isSessionValidState === null) {
    return <div>Loading...</div>;
  }

  return isSessionValidState ? <>{children}</> : null;
};

export default ProtectedRoute;
