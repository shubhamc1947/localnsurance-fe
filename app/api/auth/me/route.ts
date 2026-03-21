import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    console.log('[API] GET /api/auth/me - Request');
    const payload = await getCurrentUser();
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { companies: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { passwordHash, ...userWithoutPassword } = user;

    // Fetch latest quote with family data (for admin/planholder users)
    let latestQuote = null;
    const quote = await prisma.quote.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        planholderInfo: true,
        spouseInfo: true,
        dependants: true,
      },
    });

    if (quote) {
      latestQuote = {
        id: quote.id,
        status: quote.status,
        selectedPlan: quote.selectedPlan,
        totalCost: quote.totalCost,
        planStartDate: quote.planStartDate,
        planholderInfo: quote.planholderInfo
          ? {
              firstName: quote.planholderInfo.firstName,
              lastName: quote.planholderInfo.lastName,
              gender: quote.planholderInfo.gender,
              dateOfBirth: quote.planholderInfo.dateOfBirth,
              nationality: quote.planholderInfo.nationality,
              phone: quote.planholderInfo.phone,
            }
          : null,
        spouseInfo: quote.spouseInfo
          ? {
              firstName: quote.spouseInfo.firstName,
              lastName: quote.spouseInfo.lastName,
              gender: quote.spouseInfo.gender,
              dateOfBirth: quote.spouseInfo.dateOfBirth,
              nationality: quote.spouseInfo.nationality,
              occupation: quote.spouseInfo.occupation,
            }
          : null,
        dependants: quote.dependants.map((d) => ({
          id: d.id,
          fullName: d.fullName,
          lastName: d.lastName,
          gender: d.gender,
          dateOfBirth: d.dateOfBirth,
          relationshipToPlanholder: d.relationshipToPlanholder,
        })),
      };
    }

    // Fetch employee record (for employee users who were onboarded)
    let employeeRecord = null;
    const employee = await prisma.employee.findFirst({
      where: { email: user.email },
      orderBy: { createdAt: "desc" },
    });

    if (employee) {
      employeeRecord = {
        id: employee.id,
        fullName: employee.fullName,
        includeSpouse: employee.includeSpouse,
        spouseFirstName: employee.spouseFirstName,
        spouseLastName: employee.spouseLastName,
        spouseGender: employee.spouseGender,
        spouseDob: employee.spouseDob,
        spouseNationality: employee.spouseNationality,
        spouseOccupation: employee.spouseOccupation,
        includeDependant: employee.includeDependant,
        dependantsData: employee.dependantsData,
      };
    }

    return NextResponse.json({
      user: userWithoutPassword,
      latestQuote,
      employeeRecord,
    });
  } catch (error) {
    console.error('[API] GET /api/auth/me - Error:', error);
    return NextResponse.json(
      { error: "An error occurred while fetching user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('[API] PUT /api/auth/me - Request');
    const payload = await getCurrentUser();
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Only allow updating safe fields
    const allowedFields = [
      "firstName",
      "lastName",
      "phoneDialCode",
      "phone",
      "country",
      "state",
      "postalCode",
      "jobRole",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId as string },
      data: updateData,
      include: { companies: true },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('[API] PUT /api/auth/me - Error:', error);
    return NextResponse.json(
      { error: "An error occurred while updating user" },
      { status: 500 }
    );
  }
}
