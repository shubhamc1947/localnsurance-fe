import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getEmployeeInviteTemplate } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { employeeId } = await request.json();
    console.log(`[API] POST /api/employees/resend-invite - employeeId: ${employeeId}`);

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { company: true, quote: true },
    });

    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    // Verify ownership
    const company = await prisma.company.findUnique({ where: { id: employee.companyId } });
    if (!company || company.userId !== currentUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate new token
    const token = crypto.randomUUID();
    const tokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.employee.update({
      where: { id: employeeId },
      data: { onboardingToken: token, onboardingTokenExp: tokenExp, onboardingComplete: false },
    });

    const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboard/${token}`;
    const adminUser = await prisma.user.findUnique({ where: { id: currentUser.userId as string } });

    try {
      await sendEmail({
        to: employee.email,
        subject: `You're invited to join ${company.legalName}'s health plan - Localsurance`,
        html: getEmployeeInviteTemplate({
          employeeName: employee.fullName,
          companyName: company.legalName,
          adminName: `${adminUser?.firstName || ""} ${adminUser?.lastName || ""}`.trim(),
          onboardingUrl,
        }),
      });
      console.log(`[EMAIL] Re-sent onboarding invite to ${employee.email}`);
    } catch (emailError) {
      console.error(`[EMAIL] Failed to resend invite to ${employee.email}:`, emailError);
    }

    return NextResponse.json({ success: true, message: "Invite email resent" });
  } catch (error) {
    console.error("[API] POST /api/employees/resend-invite - Error:", error);
    return NextResponse.json({ error: "Failed to resend invite" }, { status: 500 });
  }
}
