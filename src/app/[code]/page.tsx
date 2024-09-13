// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addClick, getLinkByCode } from "@/lib/api";

const RedirectPage: React.FC = () => {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const code = path.split("/").pop();
        if (!code) return;

        const response = await fetch("/api/get-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.status === 404) {
          return;
        }

        if (origin) {
          await addClick(code);
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
