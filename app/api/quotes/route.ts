import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    console.log('[API] GET /api/quotes - Request');
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      where: { userId: user.userId as string },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('[API] GET /api/quotes - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/quotes - Request');
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      selectedPlan,
      selectedRegions,
      ageGroups,
      costPerMember,
      totalCost,
      companyId,
    } = body;

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "selectedPlan is required" },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
      data: {
        userId: user.userId as string,
        selectedPlan,
        selectedRegions: selectedRegions ?? undefined,
        ageGroups: ageGroups ?? undefined,
        costPerMember: costPerMember ?? undefined,
        totalCost: totalCost ?? undefined,
        companyId: companyId ?? undefined,
      },
      include: { company: true },
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/quotes - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
