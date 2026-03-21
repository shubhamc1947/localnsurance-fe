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
      pendingPayments,
      totalActiveCompanies,
      totalDisabledCompanies,
      rawRecentQuotes,
      rawPendingQuotes,
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
      prisma.quote.count({ where: { status: "SUBMITTED" } }),
      prisma.company.count({ where: { isActive: true } }),
      prisma.company.count({ where: { isActive: false } }),
      prisma.quote.findMany({
        include: {
          company: { select: { legalName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.quote.findMany({
        where: { status: "SUBMITTED" },
        include: {
          company: { select: { legalName: true } },
          user: { select: { email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
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

    const pendingQuotes = rawPendingQuotes.map((q) => ({
      id: q.id,
      companyName: q.company?.legalName ?? "--",
      plan: q.selectedPlan ?? "--",
      cost: q.totalCost ?? 0,
      status: q.status,
      userName: q.user ? `${q.user.firstName} ${q.user.lastName}`.trim() : "--",
      userEmail: q.user?.email ?? "--",
      createdAt: q.createdAt,
    }));

    return NextResponse.json({
      totalUsers,
      totalCompanies,
      activeQuotes: totalActiveQuotes,
      totalRevenue: totalRevenueResult._sum.amount ?? 0,
      totalEmployees,
      monthlyNewSignups,
      pendingPayments,
      totalActiveCompanies,
      totalDisabledCompanies,
      recentQuotes,
      pendingQuotes,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
