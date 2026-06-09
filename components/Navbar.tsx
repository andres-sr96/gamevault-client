"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getUsernameFromToken, removeToken } from "@/services/authToken";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = getUsernameFromToken();
    setUsername(user);
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setUsername(null);
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
    <nav className="navbar-background bg-gray-950 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b border-gray-800">
      {/* Left: Brand Anchor */}
      <Link href="/" className="navbar-title text-xl tracking-widest">
        GAMEVAULT
      </Link>

      {/* Right: Links & Session Status */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/games"
          className={`anchor transition ${isActive("/games") ? "anchor-active text-blue-400 font-bold" : "text-gray-300 hover:text-white"}`}
        >
          Browse
        </Link>
        {username ? (
          <>
            <Link
              href="/my-list"
              className={`anchor transition ${isActive("/my-list") ? "anchor-active text-blue-400 font-bold" : "text-gray-300 hover:text-white"}`}
            >
              My Vault
            </Link>

            <div className="h-4 w-px bg-gray-800" />

            {/* --- USER PROFILE COMPONENT --- */}
            <div className="flex items-center gap-3 bg-gray-900/60 pl-3 pr-2 py-1 rounded-full border border-gray-800">
              <span className="text-gray-300 text-xs font-semibold">
                {username}
              </span>

              {/* Dynamic Circular Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-inner uppercase tracking-wider ${getAvatarColor(username)}`}
              >
                {username.charAt(0)}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="h-4 w-px bg-gray-800" />

            <Link
              href="/login"
              className={`anchor transition ${isActive("/login") ? "anchor-active text-blue-400 font-bold" : "text-gray-300 hover:text-white"}`}
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
