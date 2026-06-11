"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Equal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsernameFromToken, removeToken } from "@/services/authToken";
import GlowButton from "./GlowButton";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string | null>(null);
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const user = getUsernameFromToken();
    setUsername(user);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    setUsername(null);
    setMenuState(false);
    router.push("/");
    router.refresh();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-600",
      "bg-purple-600",
      "bg-emerald-600",
      "bg-indigo-600",
      "bg-amber-600",
      "bg-rose-600",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const isActive = (path: string) => pathname === path;

  return (
<header role="banner" className="relative z-50">
      <nav className="fixed top-0 left-0 w-full px-4">
        {/* Dynamic morphing floating container wrapper */}
        <div
          className={cn(
            "mx-auto mt-4 max-w-6xl px-6 transition-all duration-300 border border-transparent text-white",
            isScrolled &&
              "bg-gray-950/70 max-w-4xl rounded-2xl border-gray-800 backdrop-blur-lg lg:px-6 shadow-xl shadow-blue-950/20",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 py-2.5">
            {/* Left: Brand Identity & Mobile Trigger */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex gap-2 items-center group"
              >
                <p className="font-black text-lg tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent uppercase">
                  GameVault
                </p>
              </Link>

              {/* Mobile Menu Icon */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden text-gray-400 hover:text-white"
              >
                {menuState ? (
                  <X className="size-6" />
                ) : (
                  <Equal className="size-6" />
                )}
              </button>
            </div>

            {/* Center Area: Desktop Navigation links */}
            <div className="absolute inset-x-0 mx-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm font-medium">
                <li>
                  <Link
                    href="/games"
                    className={`transition duration-150 ${
                      isActive("/games")
                        ? "text-blue-400 font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Browse
                  </Link>
                </li>
                {username && (
                  <li>
                    <Link
                      href="/my-list"
                      className={`transition duration-150 ${
                        isActive("/my-list")
                          ? "text-blue-400 font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      My Vault
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Right Side: Authentication / Profile Layout context */}
            <div
              className={cn(
                "mb-6 hidden w-full flex-wrap items-center justify-end rounded-2xl border border-gray-800 bg-gray-950 p-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                menuState ? "block mt-4" : "hidden",
              )}
            >
              {/* Mobile Navigation Dropdown Interceptor Links */}
              <div className="lg:hidden w-full mb-6">
                <ul className="space-y-4 text-base font-medium">
                  <li>
                    <Link
                      href="/games"
                      onClick={() => setMenuState(false)}
                      className={cn(
                        "block py-1",
                        isActive("/games") ? "text-blue-400" : "text-gray-300",
                      )}
                    >
                      Browse
                    </Link>
                  </li>
                  {username && (
                    <li>
                      <Link
                        href="/my-list"
                        onClick={() => setMenuState(false)}
                        className={cn(
                          "block py-1",
                          isActive("/my-list")
                            ? "text-blue-400"
                            : "text-gray-300",
                        )}
                      >
                        My Vault
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Dynamic Authentication Context Actions Container */}
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-fit">
                {username ? (
                  <>
                    {/* Logged In: Profile Display components */}
                    <div className="flex items-center justify-between sm:justify-start gap-3 bg-gray-900/60 pl-4 pr-2 py-1 rounded-xl border border-gray-800 w-full sm:w-auto">
                      <span className="text-gray-300 text-xs font-semibold tracking-wide">
                        {username}
                      </span>
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-inner uppercase tracking-wider",
                          getAvatarColor(username),
                        )}
                      >
                        {username.charAt(0)}
                      </div>
                    </div>
                    <GlowButton
                      onClick={handleLogout}
                      className="h-9 px-4 text-xs rounded-lg from-red-950 to-red-800/90 border-red-900/50 hover:bg-red-600 focus:ring-red-500 w-full sm:w-auto"
                    >
                      Logout
                    </GlowButton>
                  </>
                ) : (
                  <>
                    {/* Logged Out */}
                    <GlowButton
                      href="/login"
                      className={cn(
                        "h-9 px-4 text-xs rounded-lg from-gray-900 to-gray-950 border-gray-800 text-gray-300 hover:text-white w-full sm:w-auto",
                        isScrolled && "lg:hidden",
                      )}
                    >
                      Sign In
                    </GlowButton>

                    <GlowButton
                      href="/register"
                      className={cn(
                        "h-9 px-4 text-xs rounded-lg w-full sm:w-auto",
                        isScrolled
                          ? "from-blue-600 to-blue-500 border-blue-500"
                          : "",
                      )}
                    >
                      {isScrolled ? "Get Started" : "Sign Up"}
                    </GlowButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
