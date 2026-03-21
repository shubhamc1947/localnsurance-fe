import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { legalName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { website: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.quotes = { some: { status } };
    }

    const [rawCompanies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          quotes: {
            select: { selectedPlan: true, status: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              employees: true,
              quotes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    // Map to the shape the frontend expects
    const companies = rawCompanies.map((c) => ({
      id: c.id,
      name: c.legalName,
      ownerName: `${c.user.firstName} ${c.user.lastName}`.trim(),
      ownerEmail: c.user.email,
      plan: c.quotes[0]?.selectedPlan || "—",
      employeeCount: c._count.employees,
      quoteCount: c._count.quotes,
      status: c.quotes[0]?.status || "DRAFT",
      isActive: (c as Record<string, unknown>).isActive ?? true,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({
      companies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching admin companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
