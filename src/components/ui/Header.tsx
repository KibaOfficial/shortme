"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardUi, setIsDashboardUi] = useState(false);
  const activeLink = "block py-2 px-4 rounded-md bg-blue-800 text-white";
  const inactiveLink = "py-2 rounded-md";

  useEffect(() => {
    setIsDashboardUi(pathname.startsWith("/dashboard"));
  }, [pathname]);

  const isAuthPage = pathname.startsWith("/auth");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  console.log(`Current path: ${pathname}`);

  return (
    <div className="bg-gray-900 text-white top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <Image
                src="/logo.jpeg"
                alt="ShortMe logo"
                width={40}
                height={40}
              />
              <h1 className="text-xl font-semibold ml-2">ShortMe</h1>
            </a>
          </Link>
        </div>
        {isDashboardUi ? (
          <>
            <button
              onClick={toggleMenu}
              className="text-white flex items-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
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
                <button
                  onClick={toggleMenu}
                  className="text-white flex items-center mb-4"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" legacyBehavior>
                      <a className={pathname === "/" ? activeLink : inactiveLink} >
                        Home
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" legacyBehavior>
                      <a className={pathname === "/dashboard" ? activeLink : inactiveLink}>
                        Dashboard
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <Link href="/" legacyBehavior>
                  <a
                    className={
                      pathname === "/"
                        ? "bg-blue-800 text-white font-semibold py-2 px-2 rounded-md"
                        : "py-2 px-2 rounded-md text-gray-300"
                    }
                  >
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/auth" legacyBehavior>
                  <a
                    className={
                      isAuthPage
                        ? "bg-blue-800 text-white font-semibold py-2 px-2 rounded-md"
                        : "py-2 px-2 rounded-md text-gray-300"
                    }
                  >
                    Auth
                  </a>
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
