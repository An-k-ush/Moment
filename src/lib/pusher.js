import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
let pusherServer = null;

export function getPusherServer() {
  if (!pusherServer) {
    pusherServer = new PusherServer({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  return pusherServer;
}

// Client-side Pusher instance
let pusherClient = null;

export function getPusherClient() {
  if (!pusherClient && typeof window !== "undefined") {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
  }
  return pusherClient;
}
