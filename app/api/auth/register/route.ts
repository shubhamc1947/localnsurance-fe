import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneDialCode,
      phone,
      country,
      state,
      postalCode,
      companyType,
      companyLegalName,
      website,
      companyPhone,
      addressLine,
      city,
      zipCode,
      companyCountry,
      companyState,
      selectedPlan,
      selectedRegions,
      ageGroups,
      costPerMember,
      totalCost,
      includesSelf,
    } = body;

    console.log('[API] POST /api/auth/register - Request', { email });

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
          role: "USER",
          jobRole: role || undefined,
          phoneDialCode,
          phone,
          country,
          state,
          postalCode,
        },
      });

      const company = await tx.company.create({
        data: {
          userId: user.id,
          companyType,
          legalName: companyLegalName || "My Company",
          website,
          phone: companyPhone,
          addressLine,
          city,
          zipCode,
          country: companyCountry,
          state: companyState,
        },
      });

      const quote = await tx.quote.create({
        data: {
          userId: user.id,
          companyId: company.id,
          selectedPlan,
          selectedRegions: selectedRegions ?? undefined,
          ageGroups: ageGroups ?? undefined,
          costPerMember,
          totalCost,
          includesSelf,
          status: "DRAFT",
        },
      });

      return { user, company, quote };
    });

    const token = await signJWT({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    await setAuthCookie(token);

    const { passwordHash: _, ...userWithoutPassword } = result.user;

    console.log('[API] POST /api/auth/register - Success', { userId: result.user.id, email });

    return NextResponse.json(
      {
        user: userWithoutPassword,
        company: result.company,
        quote: result.quote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] POST /api/auth/register - Error:', error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
