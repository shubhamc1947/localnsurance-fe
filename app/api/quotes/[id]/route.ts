import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log('[API] GET /api/quotes/[id] - Request', { id });

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { company: true, employees: true, payments: true, invoices: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('[API] GET /api/quotes/[id] - Error:', error);
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log('[API] PUT /api/quotes/[id] - Request', { id });

    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (existingQuote.userId !== user.userId) {
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
      status,
      includeSpouse,
      includeDependant,
      planStartDate,
    } = body;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(selectedPlan !== undefined && { selectedPlan }),
        ...(selectedRegions !== undefined && { selectedRegions }),
        ...(ageGroups !== undefined && { ageGroups }),
        ...(costPerMember !== undefined && { costPerMember }),
        ...(totalCost !== undefined && { totalCost }),
        ...(companyId !== undefined && { companyId }),
        ...(status !== undefined && { status }),
        ...(includeSpouse !== undefined && { includeSpouse }),
        ...(includeDependant !== undefined && { includeDependant }),
        ...(planStartDate !== undefined && { planStartDate }),
      },
      include: { company: true },
    });

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('[API] PUT /api/quotes/[id] - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
