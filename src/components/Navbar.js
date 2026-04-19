"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radio, LogOut, User, Zap } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // Not logged in
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.03] backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap
                size={24}
                className="text-accent-cyan group-hover:text-accent-purple transition-colors duration-500"
                fill="currentColor"
              />
              <div className="absolute inset-0 blur-lg bg-accent-cyan/30 group-hover:bg-accent-purple/30 transition-colors duration-500" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              moment
            </span>
          </Link>

          {/* Search */}
          <div className="hidden sm:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <>
                {/* Go Live / Dashboard */}
                <Link
                  href={`/${user.username}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white/90 hover:border-white/15 transition-all text-sm"
                >
                  <User size={14} />
                  <span className="hidden sm:inline">@{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-accent-purple to-accent-cyan text-white rounded-lg
                    hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </nav>
  );
}
