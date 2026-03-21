import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getEmployeeInviteTemplate } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, email, personalizedMessage } = await request.json();
    console.log(`[API] POST /api/employees/add-single - fullName: ${fullName}, email: ${email}`);

    if (!fullName || !email) {
      return NextResponse.json({ error: "fullName and email are required" }, { status: 400 });
    }

    // Get user's company
    const company = await prisma.company.findFirst({
      where: { userId: currentUser.userId as string },
      orderBy: { createdAt: "desc" },
    });

    if (!company) {
      return NextResponse.json({ error: "No company found for this user" }, { status: 400 });
    }

    // Get latest quote for this company
    const quote = await prisma.quote.findFirst({
      where: { companyId: company.id, userId: currentUser.userId as string },
      orderBy: { createdAt: "desc" },
    });

    if (!quote) {
      return NextResponse.json({ error: "No quote found for this company" }, { status: 400 });
    }

    // Generate onboarding token
    const token = crypto.randomUUID();
    const tokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create employee record
    const employee = await prisma.employee.create({
      data: {
        quoteId: quote.id,
        companyId: company.id,
        fullName,
        email,
        personalizedMessage: personalizedMessage || undefined,
        onboardingToken: token,
        onboardingTokenExp: tokenExp,
      },
    });

    // Send invite email
    const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboard/${token}`;
    const adminUser = await prisma.user.findUnique({
      where: { id: currentUser.userId as string },
    });

    try {
      await sendEmail({
        to: email,
        subject: `You're invited to join ${company.legalName}'s health plan - Localsurance`,
        html: getEmployeeInviteTemplate({
          employeeName: fullName,
          companyName: company.legalName,
          adminName: `${adminUser?.firstName || ""} ${adminUser?.lastName || ""}`.trim(),
          onboardingUrl,
          personalizedMessage: personalizedMessage || undefined,
        }),
      });
      console.log(`[EMAIL] Onboarding invite sent to ${email}`);
    } catch (emailError) {
      console.error(`[EMAIL] Failed to send invite to ${email}:`, emailError);
    }

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/employees/add-single - Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
