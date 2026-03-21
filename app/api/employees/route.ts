import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const quoteId = searchParams.get("quoteId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (companyId) where.companyId = companyId;
    if (quoteId) where.quoteId = quoteId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Ensure the user can only see employees from their own companies
    const userCompanies = await prisma.company.findMany({
      where: { userId: user.userId as string },
      select: { id: true },
    });
    const userCompanyIds = userCompanies.map((c) => c.id);

    if (companyId && !userCompanyIds.includes(companyId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!companyId) {
      where.companyId = { in: userCompanyIds };
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: { quote: true, company: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ employees, total, page, totalPages });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { employees, quoteId, companyId } = body;

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json(
        { error: "employees array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!quoteId || !companyId) {
      return NextResponse.json(
        { error: "quoteId and companyId are required" },
        { status: 400 }
      );
    }

    // Verify the company belongs to the user
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company || company.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the quote belongs to the user
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote || quote.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const createdEmployees = await prisma.$transaction(
      employees.map(
        (emp: { fullName: string; email: string; personalizedMessage?: string }) =>
          prisma.employee.create({
            data: {
              quoteId,
              companyId,
              fullName: emp.fullName,
              email: emp.email,
              personalizedMessage: emp.personalizedMessage ?? undefined,
            },
          })
      )
    );

    return NextResponse.json({ employees: createdEmployees }, { status: 201 });
  } catch (error) {
    console.error("Error creating employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
