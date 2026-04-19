import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getPusherServer } from "@/lib/pusher";

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const stream = await prisma.stream.findUnique({
      where: { id },
    });

    if (!stream || stream.userId !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update stream
    const updatedStream = await prisma.stream.update({
      where: { id },
      data: {
        ...(typeof body.isLive === "boolean" && { isLive: body.isLive }),
        ...(body.title && { title: body.title }),
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    });

    // Broadcast status change via Pusher
    try {
      const pusher = getPusherServer();
      await pusher.trigger(`stream-${id}`, "status-update", {
        isLive: updatedStream.isLive,
        title: updatedStream.title,
      });
    } catch (pusherError) {
      console.error("Pusher broadcast error:", pusherError);
    }

    return NextResponse.json({ stream: updatedStream });
  } catch (error) {
    console.error("Stream update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
