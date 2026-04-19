"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export default function LivePlayer({ streamUrl }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const hideTimeout = useRef(null);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    let hls = null;

    const initHls = async () => {
      const Hls = (await import("hls.js")).default;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          liveSyncDuration: 3,
          liveMaxLatencyDuration: 10,
          liveDurationInfinity: true,
          backBufferLength: 0,
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsConnected(true);
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setIsConnected(false);
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setTimeout(() => hls.startLoad(), 3000);
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsConnected(true);
          video.play().catch(() => {});
        });
      }
    };

    initHls();

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  // Volume control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer"
      onMouseMove={resetHideTimer}
      onMouseEnter={resetHideTimer}
    >
      {/* Video Element - NO native controls */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted={isMuted}
      />

      {/* LIVE Indicator - Always visible */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Custom Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Volume Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-accent-cyan transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="relative w-24 group/vol">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-accent-cyan
                  [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.6)]
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Stream Status */}
          <div className="text-white/40 text-xs font-medium tracking-wide">
            {isConnected ? "● Connected" : "○ Connecting..."}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="text-white/80 hover:text-accent-cyan transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* No Stream Overlay */}
      {!streamUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-void-900">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            </div>
            <p className="text-white/30 text-sm">Waiting for stream...</p>
          </div>
        </div>
      )}
    </div>
  );
}
