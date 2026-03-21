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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    const [rawPayments, total, completedCount, pendingCount, failedCount, revenueResult] =
      await Promise.all([
        prisma.payment.findMany({
          where,
          include: {
            quote: {
              include: {
                company: {
                  select: {
                    id: true,
                    legalName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.payment.count({ where }),
        prisma.payment.count({ where: { status: "COMPLETED" } }),
        prisma.payment.count({ where: { status: "PENDING" } }),
        prisma.payment.count({ where: { status: "FAILED" } }),
        prisma.payment.aggregate({
          where: { status: "COMPLETED" },
          _sum: { amount: true },
        }),
      ]);

    const payments = rawPayments.map((p) => ({
      id: p.id,
      companyName: p.quote?.company?.legalName ?? "--",
      amount: p.amount,
      status: p.status,
      method: p.paymentMethod ?? "--",
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      payments,
      stats: {
        totalRevenue: revenueResult._sum.amount ?? 0,
        completedCount,
        pendingCount,
        failedCount,
      },
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
