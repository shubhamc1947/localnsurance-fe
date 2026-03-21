import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required" },
        { status: 400 }
      );
    }

    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Create a short-lived reset token (15 minutes)
    const resetToken = await new (await import("jose")).SignJWT({
      email,
      purpose: "reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(
        new TextEncoder().encode(
          process.env.JWT_SECRET || "localsurance-default-secret"
        )
      );

    return NextResponse.json({ resetToken });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying OTP" },
      { status: 500 }
    );
  }
}
