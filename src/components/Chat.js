"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { getPusherClient } from "@/lib/pusher";

export default function Chat({ streamId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Subscribe to Pusher channel
  useEffect(() => {
    if (!streamId) return;

    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(`chat-${streamId}`);

    channel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true);
    });

    channel.bind("new-message", (data) => {
      setMessages((prev) => [...prev.slice(-99), data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [streamId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const message = {
      id: Date.now().toString(),
      text: input.trim(),
      username: currentUser.username,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev.slice(-99), message]);
    setInput("");

    // Send to API
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId, text: message.text }),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Live Chat
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-white/20"
            }`}
          />
          <span className="text-[10px] text-white/30">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/20 text-xs text-center">
              No messages yet.
              <br />
              <span className="text-white/10">Be the first to say something.</span>
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in group">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-accent-cyan shrink-0">
                @{msg.username}
              </span>
              <span className="text-sm text-white/70 break-words">{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-white/[0.08]"
      >
        <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-2 border border-white/[0.06] focus-within:border-accent-cyan/30 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentUser ? "Send a message..." : "Login to chat"}
            disabled={!currentUser}
            maxLength={500}
            className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/20 outline-none disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!input.trim() || !currentUser}
            className="text-accent-cyan/60 hover:text-accent-cyan disabled:text-white/10 transition-colors disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
