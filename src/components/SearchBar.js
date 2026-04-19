"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Radio } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchUsers = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.users && data.users.length > 0) {
        setResults(data.users);
        setIsOpen(true);
      } else {
        setResults([]);
        setError("No users found");
        setIsOpen(true);
      }
    } catch {
      setError("Search failed");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(value), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length === 1) {
      navigateTo(results[0].username);
    } else if (query.trim()) {
      searchUsers(query);
    }
  };

  const navigateTo = (username) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/${username}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search @username..."
            className="w-full pl-11 pr-10 py-3 bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-xl
              text-sm text-white/90 placeholder-white/25 outline-none
              focus:border-accent-cyan/40 focus:shadow-[0_0_20px_rgba(34,211,238,0.08)]
              transition-all duration-300"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-void-800/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in">
          {isLoading && (
            <div className="px-4 py-6 text-center">
              <div className="w-5 h-5 mx-auto border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && error && (
            <div className="px-4 py-6 text-center text-white/30 text-sm">
              {error}
            </div>
          )}

          {!isLoading &&
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => navigateTo(user.username)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 truncate">
                      {user.displayName || user.username}
                    </span>
                    {user.stream?.isLive && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 rounded-full">
                        <Radio size={8} className="text-red-400" />
                        <span className="text-[10px] text-red-400 font-medium">LIVE</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/30">@{user.username}</span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
