// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserBySessionToken, isSessionValid } from "@/utils/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {

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

        const username = await getUserBySessionToken(token);
        if (username === null) {
          setIsSessionValidState(false);
          router.push("/auth");
          return;
        }

        const valid = await isSessionValid(username, token)
        setIsSessionValidState(valid);
      } catch (error) {
        console.error(error);
        setIsSessionValidState(false);
        router.push("/auth");
      }
    };

    checkSession();
      }, [cookies, router]);

      if (isSessionValidState === null) {
        return <div>Loading...</div>
      }

      if (!isSessionValidState) {
        return null;
      }

      return <>{children}</>
    }

export default ProtectedRoute;