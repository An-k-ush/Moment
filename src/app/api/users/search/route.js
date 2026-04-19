import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 1) {
      return NextResponse.json({ users: [] });
    }

    const sanitized = query.replace(/^@/, "").toLowerCase();

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: sanitized,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        pfpUrl: true,
        followersCount: true,
        stream: {
          select: {
            isLive: true,
          },
        },
      },
      take: 10,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
