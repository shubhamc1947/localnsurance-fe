import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalCompanies,
      totalActiveQuotes,
      totalRevenueResult,
      totalEmployees,
      monthlyNewSignups,
      rawRecentQuotes,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.quote.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.employee.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.quote.findMany({
        include: {
          company: { select: { legalName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const recentQuotes = rawRecentQuotes.map((q) => ({
      id: q.id,
      companyName: q.company?.legalName ?? "--",
      plan: q.selectedPlan ?? "--",
      cost: q.totalCost ?? 0,
      status: q.status,
      createdAt: q.createdAt,
    }));

    return NextResponse.json({
      totalUsers,
      totalCompanies,
      activeQuotes: totalActiveQuotes,
      totalRevenue: totalRevenueResult._sum.amount ?? 0,
      totalEmployees,
      monthlyNewSignups,
      recentQuotes,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
