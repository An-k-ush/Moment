import Link from "next/link";
import { Radio, Users } from "lucide-react";

export default function StreamCard({ stream }) {
  const { user } = stream;

  return (
    <Link href={`/${user.username}`} className="group block">
      <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-500 hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        {/* Thumbnail Area */}
        <div className="relative aspect-video bg-gradient-to-br from-void-800 to-void-900 overflow-hidden">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Center pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-accent-purple/20 animate-ping" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Radio size={20} className="text-accent-purple" />
              </div>
            </div>
          </div>

          {/* LIVE badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {user.username[0].toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white/80 truncate group-hover:text-white transition-colors">
                {stream.title}
              </h3>
              <p className="text-xs text-white/30 mt-0.5">@{user.username}</p>
            </div>
          </div>

          {/* Followers */}
          <div className="flex items-center gap-1.5 mt-3 text-white/20">
            <Users size={12} />
            <span className="text-[11px]">
              {user.followersCount.toLocaleString()} followers
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
