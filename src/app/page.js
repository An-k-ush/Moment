import { Zap, Radio, Eye, EyeOff, Clock } from "lucide-react";
import StreamCard from "@/components/StreamCard";
import SearchBar from "@/components/SearchBar";

async function getLiveStreams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/streams`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.streams || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const streams = await getLiveStreams();

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/[0.04] rounded-full blur-[120px] animate-void-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/[0.03] rounded-full blur-[100px] animate-void-drift" style={{ animationDelay: "-7s" }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          {/* Floating icon */}
          <div className="mb-8 animate-float">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-white/[0.06] flex items-center justify-center backdrop-blur-sm">
                <Zap size={36} className="text-accent-cyan" fill="currentColor" />
              </div>
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 blur-xl -z-10" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <span className="gradient-text">Live in the</span>
            <br />
            <span className="text-white">Moment.</span>
          </h1>

          <p className="text-white/40 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
            Ephemeral streams that exist only in the{" "}
            <span className="text-accent-cyan font-medium">now</span>. No replays.
            No recordings. Just this moment.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md mb-6">
            <SearchBar />
          </div>

          {/* Features strip */}
          <div className="flex items-center gap-6 sm:gap-8 text-white/20 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>Live Only</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-2">
              <EyeOff size={14} />
              <span>No Replays</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Ephemeral</span>
            </div>
          </div>
        </section>

        {/* Live Streams Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-red-400" />
              <h2 className="text-lg font-semibold text-white/70" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Live Now
              </h2>
            </div>
            {streams.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 rounded-full text-[11px] font-medium text-red-400">
                {streams.length}
              </span>
            )}
          </div>

          {streams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {streams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.04] flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 rounded-full bg-white/[0.08]" />
                  </div>
                </div>
                <div className="absolute -inset-4 rounded-full bg-accent-purple/[0.03] blur-2xl" />
              </div>
              <p className="text-white/20 text-lg mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                The void is quiet...
              </p>
              <p className="text-white/10 text-sm">
                No one is streaming right now. Check back later.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
