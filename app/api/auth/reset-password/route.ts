import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { resetToken, newPassword } = await request.json();
    console.log('[API] POST /api/auth/reset-password - Request');

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { error: "Reset token and new password are required" },
        { status: 400 }
      );
    }

    const payload = await verifyJWT(resetToken);
    if (!payload || payload.purpose !== "reset" || !payload.email) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const email = payload.email as string;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    console.log('[API] POST /api/auth/reset-password - Success', { email });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error('[API] POST /api/auth/reset-password - Error:', error);
    return NextResponse.json(
      { error: "An error occurred while resetting password" },
      { status: 500 }
    );
  }
}
