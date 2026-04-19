"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      router.push(`/${data.user.username}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-purple/[0.05] rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap size={28} className="text-accent-cyan" fill="currentColor" />
            <span className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              moment
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white/80">Create your account</h2>
          <p className="text-white/30 text-sm mt-1">Join the ephemeral revolution</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Display Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/90 placeholder-white/20
                    focus:border-accent-purple/40 focus:shadow-[0_0_20px_rgba(168,85,247,0.08)] transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-cyan/60 text-sm font-medium">@</span>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_handle"
                  required
                  pattern="[a-zA-Z0-9_]{3,20}"
                  className="w-full pl-9 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/90 placeholder-white/20
                    focus:border-accent-cyan/40 focus:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/90 placeholder-white/20
                    focus:border-accent-purple/40 focus:shadow-[0_0_20px_rgba(168,85,247,0.08)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/90 placeholder-white/20
                    focus:border-accent-purple/40 focus:shadow-[0_0_20px_rgba(168,85,247,0.08)] transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gradient text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
