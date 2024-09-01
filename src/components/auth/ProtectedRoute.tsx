// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isSessionValid } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isSessionValidState, setIsSessionValidState] = useState<boolean | null>(null);
  const router = useRouter();
  const [cookies] = useCookies(['session_token']);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = cookies['session_token'];
        if (!token) {
          setIsSessionValidState(false);
          router.push("/auth");
          return;
        }

        const isValid = await isSessionValid(token);
        setIsSessionValidState(isValid);

        if (!isValid) {
          router.push("/auth");
        }
      } catch (error) {
        console.error(error);
        setIsSessionValidState(false);
        router.push("/auth");
      }
    };

    checkSession();
  }, [cookies, router]);

  if (isSessionValidState === null) {
    return <div>Loading...</div>;
  }

  return isSessionValidState ? <>{children}</> : null;
};

export default ProtectedRoute;
