import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quoteId, ...data } = body;
    console.log(`[API] POST /api/planholder - Saving planholder info`, { quoteId, userId: currentUser.userId });

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId is required" }, { status: 400 });
    }

    // Verify quote ownership
    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote || quote.userId !== currentUser.userId) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const result = await prisma.planholderInfo.upsert({
      where: { quoteId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        phone: data.phone,
        phoneType: data.phoneType,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        height: data.height,
        weight: data.weight,
      },
      create: {
        quoteId,
        userId: currentUser.userId as string,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        phone: data.phone,
        phoneType: data.phoneType,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        height: data.height,
        weight: data.weight,
      },
    });

    console.log(`[API] POST /api/planholder - Saved successfully`, { id: result.id });
    return NextResponse.json({ planholderInfo: result }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/planholder - Error:", error);
    return NextResponse.json({ error: "Failed to save planholder info" }, { status: 500 });
  }
}
