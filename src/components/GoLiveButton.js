"use client";

import { useState } from "react";
import { Radio, RadioOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoLiveButton({ streamId, isLive, streamTitle }) {
  const [live, setLive] = useState(isLive);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(streamTitle || "");
  const [showTitleInput, setShowTitleInput] = useState(false);
  const router = useRouter();

  const toggleLive = async () => {
    // If going live and no title set, show title input first
    if (!live && !showTitleInput && !title.trim()) {
      setShowTitleInput(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/streams/${streamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isLive: !live,
          ...(title.trim() && { title: title.trim() }),
        }),
      });

      if (res.ok) {
        setLive(!live);
        setShowTitleInput(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle live:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Title input (shown before going live) */}
      {showTitleInput && !live && (
        <div className="animate-fade-in">
          <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
            Stream Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you streaming?"
            maxLength={100}
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white/90 placeholder-white/20
              focus:border-accent-cyan/40 focus:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all outline-none"
            onKeyDown={(e) => e.key === "Enter" && toggleLive()}
            autoFocus
          />
        </div>
      )}

      {/* Go Live / End Stream Button */}
      <button
        onClick={toggleLive}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          live
            ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]"
            : "btn-gradient text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        }`}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : live ? (
          <>
            <RadioOff size={18} />
            End Stream
          </>
        ) : showTitleInput ? (
          <>
            <Radio size={18} />
            Start Streaming
          </>
        ) : (
          <>
            <Radio size={18} />
            Go Live
          </>
        )}
      </button>
    </div>
  );
}
