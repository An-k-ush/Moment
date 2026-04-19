import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPusherServer } from "@/lib/pusher";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { streamId, text } = await request.json();

    if (!streamId || !text?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = {
      id: Date.now().toString(),
      text: text.trim().slice(0, 500),
      username: session.username,
      timestamp: new Date().toISOString(),
    };

    // Broadcast via Pusher
    try {
      const pusher = getPusherServer();
      await pusher.trigger(`chat-${streamId}`, "new-message", message);
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
