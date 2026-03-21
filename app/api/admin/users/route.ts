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
    const role = searchParams.get("role");
    const type = searchParams.get("type");
    const skip = (page - 1) * limit;

    // Handle type=employees: query from employees table
    if (type === "employees") {
      const empWhere: Record<string, unknown> = {};
      if (search) {
        empWhere.OR = [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const [rawEmployees, total] = await Promise.all([
        prisma.employee.findMany({
          where: empWhere,
          include: {
            quote: {
              include: {
                company: {
                  select: { legalName: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.employee.count({ where: empWhere }),
      ]);

      const employees = rawEmployees.map((e) => ({
        id: e.id,
        fullName: e.fullName ?? "",
        email: e.email ?? "",
        companyName: e.quote?.company?.legalName ?? "--",
        onboardingStatus: e.status ?? "PENDING",
        onboardingComplete: e.onboardingComplete ?? false,
        personalDetailsFilled: !!(e.phone && e.gender && e.dateOfBirth),
        createdAt: e.createdAt,
      }));

      return NextResponse.json({
        employees,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Handle type=platform: super admins only
    if (type === "platform") {
      const where: Record<string, unknown> = { role: "SUPER_ADMIN" };
      if (search) {
        where.OR = [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ];
        where.AND = [{ role: "SUPER_ADMIN" }];
        delete where.role;
      }

      const [rawUsers, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      const users = rawUsers.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        companyName: null,
        status: "ACTIVE",
        createdAt: u.createdAt,
      }));

      return NextResponse.json({
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Handle type=admins: users with companies (role USER + has companies)
    if (type === "admins") {
      const where: Record<string, unknown> = {
        role: "USER",
        companies: { some: {} },
      };
      if (search) {
        where.OR = [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { companies: { some: { legalName: { contains: search, mode: "insensitive" } } } },
        ];
        where.AND = [{ role: "USER" }, { companies: { some: {} } }];
        delete where.role;
        delete where.companies;
      }

      const [rawUsers, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            companies: {
              select: {
                id: true,
                legalName: true,
                _count: { select: { employees: true } },
                quotes: {
                  select: { status: true },
                  orderBy: { createdAt: "desc" as const },
                  take: 1,
                },
              },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      const users = rawUsers.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        companyName: u.companies[0]?.legalName ?? null,
        companyId: u.companies[0]?.id ?? null,
        quoteStatus: u.companies[0]?.quotes[0]?.status ?? "DRAFT",
        employeeCount: u.companies[0]?._count.employees ?? 0,
        status: "ACTIVE",
        createdAt: u.createdAt,
      }));

      return NextResponse.json({
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // Default: all users (original behavior)
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [rawUsers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneDialCode: true,
          phone: true,
          country: true,
          state: true,
          postalCode: true,
          jobRole: true,
          createdAt: true,
          updatedAt: true,
          companies: {
            select: { legalName: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const users = rawUsers.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      companyName: u.companies[0]?.legalName ?? null,
      status: "ACTIVE",
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
