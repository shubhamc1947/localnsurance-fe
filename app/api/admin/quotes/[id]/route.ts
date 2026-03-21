import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getPlanActivatedTemplate } from "@/lib/email-templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId as string },
    });
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        company: true,
        employees: true,
        payments: true,
        invoices: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error fetching admin quote detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId as string },
    });
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["DRAFT", "SUBMITTED", "ACTIVE", "EXPIRED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const existingQuote = await prisma.quote.findUnique({ where: { id } });
    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        company: true,
      },
    });

    // Send activation email when status changes to ACTIVE
    if (status === "ACTIVE" && updatedQuote.user) {
      try {
        const html = getPlanActivatedTemplate({
          userName: updatedQuote.user.firstName || "there",
          companyName: updatedQuote.company?.legalName || "your company",
          planName: (updatedQuote.selectedPlan || "standard").charAt(0).toUpperCase() + (updatedQuote.selectedPlan || "standard").slice(1),
        });
        await sendEmail({
          to: updatedQuote.user.email,
          subject: "Your Plan Has Been Activated - Localsurance",
          html,
        });
      } catch (emailError) {
        console.error("[API] Failed to send activation email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ quote: updatedQuote });
  } catch (error) {
    console.error("Error updating admin quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
