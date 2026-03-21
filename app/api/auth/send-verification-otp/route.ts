import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getOtpEmailTemplate } from "@/lib/email-templates";

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

    // Log OTP as fallback in case SMTP fails
    console.log(`[DEV] Email verification OTP for ${email}: ${code}`);

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email - Localsurance",
        html: getOtpEmailTemplate(code),
      });
      console.log(`[API] OTP email sent to ${email}`);
    } catch (emailError) {
      console.error(`[API] Failed to send OTP email, code: ${code}`, emailError);
      // Still return success - user can check server logs in dev
    }

    return NextResponse.json({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.error("[API] POST /api/auth/send-verification-otp - Error:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
