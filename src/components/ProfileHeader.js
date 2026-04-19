import { Users, Radio } from "lucide-react";

export default function ProfileHeader({ user }) {
  const isLive = user.stream?.isLive;

  return (
    <div className="relative">
      {/* Banner gradient */}
      <div className="h-32 sm:h-40 bg-gradient-to-br from-accent-purple/20 via-void-800 to-accent-cyan/20 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
      </div>

      <div className="relative px-4 sm:px-6 -mt-12 sm:-mt-14 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-void-900
                bg-gradient-to-br from-accent-purple to-accent-cyan
                flex items-center justify-center text-3xl font-bold text-white shrink-0
                ${isLive ? "ring-2 ring-red-500 ring-offset-2 ring-offset-void-900" : ""}`}
            >
              {user.pfpUrl ? (
                <img
                  src={user.pfpUrl}
                  alt={user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.username[0].toUpperCase()
              )}
            </div>
            {isLive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full">
                <Radio size={10} className="text-white" />
                <span className="text-[10px] font-bold text-white uppercase">Live</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {user.displayName || user.username}
            </h1>
            <p className="text-white/30 text-sm mt-0.5">@{user.username}</p>
            {user.bio && (
              <p className="text-white/50 text-sm mt-2 max-w-md">{user.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] backdrop-blur-md rounded-lg border border-white/[0.06]">
              <Users size={14} className="text-accent-purple" />
              <span className="text-sm font-semibold text-white/70">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-xs text-white/30">followers</span>
            </div>
          </div>
        </div>

        {/* Stream Title */}
        {isLive && user.stream?.title && (
          <div className="mt-4 px-4 py-2.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
            <p className="text-sm text-white/60">
              <span className="text-accent-cyan font-medium">Streaming: </span>
              {user.stream.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
