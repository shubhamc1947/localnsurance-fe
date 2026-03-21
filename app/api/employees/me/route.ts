import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employee = await prisma.employee.findFirst({
      where: { email: currentUser.email as string },
      include: { company: true, quote: true },
    });

    if (!employee) {
      return NextResponse.json({ employee: null });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("[API] GET /api/employees/me - Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, ...data } = body;

    console.log(`[API] PUT /api/employees/me - Looking up employee for email: ${currentUser.email}, userId: ${currentUser.userId}`);

    const employee = await prisma.employee.findFirst({
      where: { email: currentUser.email as string },
    });

    if (!employee) {
      console.log(`[API] PUT /api/employees/me - No employee found for email: ${currentUser.email}`);
      // Fallback: if this is actually an admin (has companies), they shouldn't be here
      // Return a helpful error
      const userCompanies = await prisma.company.findMany({ where: { userId: currentUser.userId as string }, select: { id: true } });
      if (userCompanies.length > 0) {
        return NextResponse.json({ error: "You are a company admin. Please use the quote-based API instead.", isAdmin: true }, { status: 400 });
      }
      return NextResponse.json({ error: "Employee not found. Please contact your administrator." }, { status: 404 });
    }

    console.log(`[API] PUT /api/employees/me - Found employee: ${employee.id}, section: ${section}`);

    let updateData: Record<string, unknown> = {};

    if (section === "personal") {
      updateData = {
        fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim() || employee.fullName,
        phone: data.phone,
        phoneType: data.phoneType,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data.nationality,
        height: data.height,
        weight: data.weight,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        occupation: data.occupation,
        occupationIndustry: data.occupationIndustry,
      };
    } else if (section === "spouse") {
      updateData = {
        includeSpouse: true,
        spouseFirstName: data.firstName,
        spouseLastName: data.lastName,
        spousePreferredName: data.preferredName,
        spouseGender: data.gender,
        spouseDob: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        spouseCountry: data.country,
        spouseNationality: data.nationality,
        spouseHeight: data.height,
        spouseWeight: data.weight,
        spouseOccupation: data.occupation,
        spouseOccIndustry: data.occupationIndustry,
      };
    } else if (section === "dependants") {
      updateData = {
        includeDependant: true,
        dependantsData: data.dependants || [],
      };
    } else if (section === "no-spouse") {
      updateData = { includeSpouse: false };
    } else if (section === "no-dependants") {
      updateData = { includeDependant: false };
    }

    const updated = await prisma.employee.update({
      where: { id: employee.id },
      data: updateData,
    });

    return NextResponse.json({ employee: updated });
  } catch (error) {
    console.error("[API] PUT /api/employees/me - Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
