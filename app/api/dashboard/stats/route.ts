import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    console.log('[API] GET /api/dashboard/stats - Request');
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId as string;

    // Get user's companies
    const userCompanies = await prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });
    const userCompanyIds = userCompanies.map((c) => c.id);

    // If user has no companies, they're an employee - return stats for their own record
    if (userCompanyIds.length === 0) {
      const ownEmployee = await prisma.employee.findFirst({
        where: { email: user.email as string },
        include: { quote: true },
      });

      const ownStatus = ownEmployee?.status || "PENDING";
      const ownCost = ownEmployee?.quote?.costPerMember || 0;

      return NextResponse.json({
        totalEmployees: ownEmployee ? 1 : 0,
        activeEmployees: ownStatus === "ACTIVE" ? 1 : 0,
        pendingEmployees: ownStatus === "PENDING" ? 1 : 0,
        canceledEmployees: ownStatus === "CANCELED" ? 1 : 0,
        totalQuotes: ownEmployee ? 1 : 0,
        activeQuotes: ownStatus === "ACTIVE" ? 1 : 0,
        totalCostFromActiveQuotes: ownCost,
        recentInvoices: [],
      });
    }

    // Run all queries in parallel
    const [
      totalEmployees,
      activeEmployees,
      pendingEmployees,
      canceledEmployees,
      totalQuotes,
      activeQuotes,
      activeQuotesData,
      recentInvoices,
    ] = await Promise.all([
      // Total employees count
      prisma.employee.count({
        where: { companyId: { in: userCompanyIds } },
      }),
      // Active employees count
      prisma.employee.count({
        where: { companyId: { in: userCompanyIds }, status: "ACTIVE" },
      }),
      // Pending employees count
      prisma.employee.count({
        where: { companyId: { in: userCompanyIds }, status: "PENDING" },
      }),
      // Canceled employees count
      prisma.employee.count({
        where: { companyId: { in: userCompanyIds }, status: "CANCELED" },
      }),
      // Total quotes count
      prisma.quote.count({
        where: { userId },
      }),
      // Active quotes count
      prisma.quote.count({
        where: { userId, status: "ACTIVE" },
      }),
      // Active quotes data for total cost calculation
      prisma.quote.findMany({
        where: { userId, status: "ACTIVE" },
        select: { totalCost: true },
      }),
      // Recent invoices (last 5)
      prisma.invoice.findMany({
        where: { companyId: { in: userCompanyIds } },
        include: { quote: true, company: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // Calculate total cost from active quotes
    const totalCostFromActiveQuotes = activeQuotesData.reduce(
      (sum, q) => sum + (q.totalCost || 0),
      0
    );

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      pendingEmployees,
      canceledEmployees,
      totalQuotes,
      activeQuotes,
      totalCostFromActiveQuotes,
      recentInvoices,
    });
  } catch (error) {
    console.error('[API] GET /api/dashboard/stats - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
