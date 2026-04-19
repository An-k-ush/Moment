import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signToken, createCookieOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, username, password, displayName } = await request.json();

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric + underscores, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters (letters, numbers, underscores only)" },
        { status: 400 }
      );
    }

    // Check if email or username already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "Email" : "Username";
      return NextResponse.json(
        { error: `${field} is already taken` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + stream in transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        displayName: displayName || username,
        stream: {
          create: {},
        },
      },
      include: { stream: true },
    });

    // Sign JWT
    const token = await signToken({
      sub: user.id,
      username: user.username,
    });

    // Build response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          streamKey: user.stream.streamKey,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    const cookieOpts = createCookieOptions();
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
