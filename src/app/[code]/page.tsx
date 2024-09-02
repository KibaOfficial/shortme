// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLinkByCode } from "@/lib/api";

const RedirectPage: React.FC = () => {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const code = path.split("/").pop();
        if (!code) return;

        const { status, origin } = await getLinkByCode(code);

        if (status === 404) {
          console.error("Link not found");
          return;
        }

        if (origin) {
          router.replace(origin.toString());
        }
      } catch (error) {
        console.error("Unexpected error occurred:", error);
      }
    };

    handleRedirect();
  }, [path, router]);

  return null;
};

export default RedirectPage;
