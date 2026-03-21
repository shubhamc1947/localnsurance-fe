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
    console.log(`[API] POST /api/spouse - Saving spouse info`, { quoteId, userId: currentUser.userId });

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId is required" }, { status: 400 });
    }

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote || quote.userId !== currentUser.userId) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const result = await prisma.spouseInfo.upsert({
      where: { quoteId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        preferredName: data.preferredName,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        occupation: data.occupation,
        occupationIndustry: data.occupationIndustry,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        height: data.height,
        weight: data.weight,
      },
      create: {
        quoteId,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        preferredName: data.preferredName,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        occupation: data.occupation,
        occupationIndustry: data.occupationIndustry,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        height: data.height,
        weight: data.weight,
      },
    });

    // Also update quote
    await prisma.quote.update({
      where: { id: quoteId },
      data: { includeSpouse: true },
    });

    console.log(`[API] POST /api/spouse - Saved successfully`, { id: result.id });
    return NextResponse.json({ spouseInfo: result }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/spouse - Error:", error);
    return NextResponse.json({ error: "Failed to save spouse info" }, { status: 500 });
  }
}
