import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getEmployeeInviteTemplate } from "@/lib/email-templates";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/employees - Request');
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

    // If user has no companies, they're an employee - return their own record
    if (userCompanyIds.length === 0) {
      const ownEmployee = await prisma.employee.findFirst({
        where: { email: user.email as string },
        include: { quote: true, company: true },
      });
      if (ownEmployee) {
        const nameParts = ownEmployee.fullName.split(" ");
        const dependantsData = ownEmployee.dependantsData as unknown[] | null;
        const mappedOwn = {
          id: ownEmployee.id,
          fullName: ownEmployee.fullName,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: ownEmployee.email,
          status: ownEmployee.status,
          country: ownEmployee.country || "",
          countryFlag: "",
          phone: ownEmployee.phone || "",
          gender: ownEmployee.gender || "",
          dateOfBirth: ownEmployee.dateOfBirth,
          nationality: ownEmployee.nationality || "",
          height: ownEmployee.height || "",
          weight: ownEmployee.weight || "",
          includeSpouse: ownEmployee.includeSpouse,
          includeDependant: ownEmployee.includeDependant,
          dependantsCount: dependantsData?.length || 0,
          onboardingComplete: ownEmployee.onboardingComplete,
          planId: ownEmployee.quoteId?.slice(0, 8)?.toUpperCase() || "N/A",
          companyName: ownEmployee.company?.legalName || "",
          planName: ownEmployee.quote?.selectedPlan || "",
          annualCost: ownEmployee.quote?.costPerMember || null,
          createdAt: ownEmployee.createdAt,
        };
        return NextResponse.json({ employees: [mappedOwn], total: 1, page: 1, totalPages: 1 });
      }
      return NextResponse.json({ employees: [], total: 0, page: 1, totalPages: 1 });
    }

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

    const mapped = employees.map((emp) => {
      const nameParts = emp.fullName.split(" ");
      const dependantsData = emp.dependantsData as unknown[] | null;
      return {
        id: emp.id,
        fullName: emp.fullName,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: emp.email,
        status: emp.status,
        country: emp.country || "",
        countryFlag: "",
        phone: emp.phone || "",
        gender: emp.gender || "",
        dateOfBirth: emp.dateOfBirth,
        nationality: emp.nationality || "",
        height: emp.height || "",
        weight: emp.weight || "",
        includeSpouse: emp.includeSpouse,
        includeDependant: emp.includeDependant,
        dependantsCount: dependantsData?.length || 0,
        onboardingComplete: emp.onboardingComplete,
        planId: emp.quoteId?.slice(0, 8)?.toUpperCase() || "N/A",
        companyName: emp.company?.legalName || "",
        planName: emp.quote?.selectedPlan || "",
        annualCost: emp.quote?.costPerMember || null,
        createdAt: emp.createdAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ employees: mapped, total, page, totalPages });
  } catch (error) {
    console.error('[API] GET /api/employees - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/employees - Request');
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

    // Generate onboarding tokens and send invitation emails
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId as string },
    });

    for (const emp of createdEmployees) {
      const token = crypto.randomUUID();
      const tokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await prisma.employee.update({
        where: { id: emp.id },
        data: { onboardingToken: token, onboardingTokenExp: tokenExp },
      });

      const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboard/${token}`;

      try {
        await sendEmail({
          to: emp.email,
          subject: `You're invited to join ${company?.legalName || "your company"}'s health plan - Localsurance`,
          html: getEmployeeInviteTemplate({
            employeeName: emp.fullName,
            companyName: company?.legalName || "Your Company",
            adminName: `${adminUser?.firstName || ""} ${adminUser?.lastName || ""}`.trim(),
            onboardingUrl,
            personalizedMessage: emp.personalizedMessage || undefined,
          }),
        });
        console.log(`[EMAIL] Onboarding invite sent to ${emp.email}`);
      } catch (emailError) {
        console.error(`[EMAIL] Failed to send invite to ${emp.email}:`, emailError);
      }
    }

    return NextResponse.json({ employees: createdEmployees }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/employees - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
