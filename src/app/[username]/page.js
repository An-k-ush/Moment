import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import ProfileHeader from "@/components/ProfileHeader";
import LivePlayer from "@/components/LivePlayer";
import Chat from "@/components/Chat";
import { getSession } from "@/lib/auth";
import GoLiveButton from "@/components/GoLiveButton";
import { WifiOff } from "lucide-react";

async function getUser(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        pfpUrl: true,
        followersCount: true,
        stream: {
          select: {
            id: true,
            isLive: true,
            streamKey: true,
            title: true,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return { title: "User Not Found — Moment" };
  }

  return {
    title: `@${user.username} — Moment`,
    description: user.bio || `Watch @${user.username} live on Moment.`,
  };
}

export default async function UserDashboard({ params }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  const session = await getSession();
  const isLive = user.stream?.isLive;
  const isOwner = session?.sub === user.id;

  // Construct HLS URL (would come from media server in production)
  const streamUrl = isLive
    ? `http://localhost:8085/live/${user.stream.streamKey}/index.m3u8`
    : null;

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-accent-purple/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-cyan/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Content Area */}
        <div className="mt-6">
          {isLive ? (
            <div className="space-y-4">
              {/* End Stream button for owner */}
              {isOwner && (
                <div className="max-w-xs">
                  <GoLiveButton
                    streamId={user.stream.id}
                    isLive={true}
                    streamTitle={user.stream.title}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                {/* Video Player */}
                <div>
                  <LivePlayer streamUrl={streamUrl} />
                </div>

                {/* Chat Sidebar */}
                <div className="h-[calc(56.25vw)] lg:h-[500px]">
                  <Chat
                    streamId={user.stream.id}
                    currentUser={session ? { username: session.username } : null}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Offline State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                {/* Rotating rings */}
                <div className="w-32 h-32 rounded-full border border-white/[0.04] flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-white/[0.06] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                      <WifiOff size={24} className="text-white/15" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-8 rounded-full bg-accent-purple/[0.03] blur-3xl" />
              </div>

              <h3
                className="text-xl font-semibold text-white/30 mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Currently Offline
              </h3>
              <p className="text-white/15 text-sm max-w-xs">
                @{user.username} is not streaming right now. Come back later to catch them live.
              </p>

              {isOwner && (
                <div className="mt-8 glass-card p-6 max-w-sm w-full text-left space-y-5">
                  {/* Go Live Button */}
                  <GoLiveButton
                    streamId={user.stream.id}
                    isLive={false}
                    streamTitle={user.stream.title}
                  />

                  {/* Stream Key */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/50 mb-3">Your Stream Key</h4>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white/[0.04] rounded-lg text-xs text-accent-cyan/70 font-mono truncate">
                        {user.stream.streamKey}
                      </code>
                    </div>
                    <p className="text-[11px] text-white/20 mt-2">
                      Use this key in OBS or your streaming software to go live.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
