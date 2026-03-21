import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    console.log(`[API] POST /api/auth/verify-email-otp - Verifying OTP for: ${email}`);

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
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
      console.log(`[API] POST /api/auth/verify-email-otp - Invalid or expired OTP for: ${email}`);
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    console.log(`[API] POST /api/auth/verify-email-otp - Email verified for: ${email}`);
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("[API] POST /api/auth/verify-email-otp - Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
