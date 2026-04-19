import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const streams = await prisma.stream.findMany({
      where: { isLive: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            pfpUrl: true,
            followersCount: true,
          },
        },
      },
    });

    return NextResponse.json({ streams });
  } catch (error) {
    console.error("Streams error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
