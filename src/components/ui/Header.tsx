"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import Logger from "@/lib/logger";
import Cookies from "js-cookie";
import { Button } from "./button";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardUi, setIsDashboardUi] = useState(false);
  const [error, setError] = useState('');
  const activeLink = "primary";
  const inactiveLink = "secondary";

  const router = useRouter();

  useEffect(() => {
    setIsDashboardUi(pathname.startsWith("/dashboard"));
  }, [pathname]);

  useEffect(() => {
    Logger({ status: "INFO", message: `Current path: ${pathname}` });
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isAuthPage = pathname.startsWith("/auth");

  const logoutHandler = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      });

      if (response.ok) {
        Cookies.remove('session_token');
        router.push('/auth');
      } else {
        const data = await response.json();
        setError(data.message || 'Logout failed');
      }
    } catch (error) {
      Logger({ status: "ERROR", message: `${error}` });
      setError('Logout failed');
    }
  };

  return (
    <div className="bg-gray-900 text-white top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpeg"
              alt="ShortMe logo"
              width={40}
              height={40}
            />
            <h1 className="text-xl font-semibold ml-2">ShortMe</h1>
          </Link>
        </div>
        {isDashboardUi ? (
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </Button>
            <div
              className={`fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity ${
                isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden="true"
            >
              <div
                className={`fixed top-0 right-0 w-64 h-full bg-gray-800 text-white p-4 transition-transform ${
                  isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <Button
                  variant="link"
                  onClick={toggleMenu}
                  className="text-white"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </Button>
                <ul className="space-y-4 flex flex-col items-start">
                  {error && <li className="text-red-500">{error}</li>}
                  <li>
                    <Button
                      variant={pathname === "/" ? activeLink : inactiveLink}
                    >
                      <a href="/">
                        Home
                      </a>
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={pathname === "/dashboard" ? activeLink : inactiveLink}
                    >
                      <a href="/dashboard" >
                        Dashboard
                      </a>
                    </Button>
                  </li>
                  <li>
                    <Button onClick={logoutHandler} variant="primary">
                      Logout
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <Link href="/" className={pathname === "/" ? "bg-blue-800 text-white font-semibold py-2 px-2 rounded-md" : "py-2 px-2 rounded-md text-gray-300"}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auth" className={isAuthPage ? "bg-blue-800 text-white font-semibold py-2 px-2 rounded-md" : "py-2 px-2 rounded-md text-gray-300"}>
                  Auth
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Header;
