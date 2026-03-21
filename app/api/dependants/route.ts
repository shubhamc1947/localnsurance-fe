import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quoteId, dependants } = await request.json();
    console.log(`[API] POST /api/dependants - Saving ${dependants?.length || 0} dependants`, { quoteId });

    if (!quoteId || !dependants || !Array.isArray(dependants)) {
      return NextResponse.json({ error: "quoteId and dependants array are required" }, { status: 400 });
    }

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote || quote.userId !== currentUser.userId) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Delete existing and replace
    await prisma.dependantInfo.deleteMany({ where: { quoteId } });

    const created = await prisma.$transaction(
      dependants.map((d: any) =>
        prisma.dependantInfo.create({
          data: {
            quoteId,
            fullName: d.fullName || "",
            lastName: d.lastName || "",
            preferredName: d.preferredName,
            gender: d.gender,
            dateOfBirth: d.dob ? new Date(d.dob) : null,
            country: d.country,
            nationality: d.nationality,
            height: d.height,
            weight: d.weight,
            relationshipToPlanholder: d.relationshipToPlanholder,
            occupation: d.occupation,
          },
        })
      )
    );

    // Update quote
    await prisma.quote.update({
      where: { id: quoteId },
      data: { includeDependant: true },
    });

    console.log(`[API] POST /api/dependants - Saved ${created.length} dependants`);
    return NextResponse.json({ dependants: created }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/dependants - Error:", error);
    return NextResponse.json({ error: "Failed to save dependants" }, { status: 500 });
  }
}
