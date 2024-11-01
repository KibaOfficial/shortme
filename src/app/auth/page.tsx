// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import AuthForm from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', { method: 'POST' });
        const data = await response.json();

        if (response.status === 200 && data.isValid) {
          router.push('/dashboard');
        } else {
          return;
        }
      } catch (err) {
        console.error("Error verifying session:", err);
      }
    };
    verifySession();
  }, [router]);


  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <AuthForm />
    </div>
  );
}

export default AuthPage;
