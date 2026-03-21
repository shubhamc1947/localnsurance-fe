import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log(`[API] POST /api/auth/send-verification-otp - Sending OTP to: ${email}`);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    // TODO: Replace with real email sending (SMTP/SendGrid/etc.)
    console.log(`[DEV] Email verification OTP for ${email}: ${code}`);

    return NextResponse.json({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.error("[API] POST /api/auth/send-verification-otp - Error:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
