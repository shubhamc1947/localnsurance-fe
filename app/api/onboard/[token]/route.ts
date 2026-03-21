import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// GET /api/onboard/[token] - Validate onboarding token and return employee info
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const employee = await prisma.employee.findUnique({
      where: { onboardingToken: token },
      include: {
        company: { select: { id: true, legalName: true } },
        quote: { select: { id: true, selectedPlan: true } },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid onboarding link. Please contact your administrator." },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (
      employee.onboardingTokenExp &&
      new Date(employee.onboardingTokenExp) < new Date()
    ) {
      return NextResponse.json(
        { error: "This onboarding link has expired. Please contact your administrator for a new one." },
        { status: 410 }
      );
    }

    // Check if onboarding is already complete
    if (employee.onboardingComplete) {
      return NextResponse.json(
        { error: "You have already completed onboarding. Please log in instead." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
        companyId: employee.companyId,
      },
      company: {
        legalName: employee.company.legalName,
      },
      quote: {
        selectedPlan: employee.quote.selectedPlan,
      },
    });
  } catch (error) {
    console.error("Onboard GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// PUT /api/onboard/[token] - Save employee onboarding data step by step
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { step } = body;

    const employee = await prisma.employee.findUnique({
      where: { onboardingToken: token },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid onboarding link." },
        { status: 404 }
      );
    }

    if (
      employee.onboardingTokenExp &&
      new Date(employee.onboardingTokenExp) < new Date()
    ) {
      return NextResponse.json(
        { error: "This onboarding link has expired." },
        { status: 410 }
      );
    }

    if (employee.onboardingComplete) {
      return NextResponse.json(
        { error: "Onboarding already completed." },
        { status: 409 }
      );
    }

    let updateData: Record<string, unknown> = {};

    switch (step) {
      case 1: {
        // Set password
        const { password } = body;
        if (!password || password.length < 8) {
          return NextResponse.json(
            { error: "Password must be at least 8 characters." },
            { status: 400 }
          );
        }
        const hashed = await hashPassword(password);
        updateData = { passwordHash: hashed };
        break;
      }

      case 2: {
        // Save personal details
        const {
          personalDetails,
        } = body;
        if (!personalDetails) {
          return NextResponse.json(
            { error: "Personal details are required." },
            { status: 400 }
          );
        }
        updateData = {
          fullName:
            personalDetails.firstName && personalDetails.lastName
              ? `${personalDetails.firstName} ${personalDetails.lastName}`
              : employee.fullName,
          email: personalDetails.email || employee.email,
          country: personalDetails.country || null,
          state: personalDetails.state || null,
          postalCode: personalDetails.postalCode || null,
          phone: personalDetails.phone || null,
          phoneType: personalDetails.phoneType || null,
          gender: personalDetails.gender || null,
          dateOfBirth: personalDetails.dob
            ? new Date(personalDetails.dob)
            : null,
          nationality: personalDetails.nationality || null,
          height: personalDetails.height || null,
          weight: personalDetails.weight || null,
        };
        break;
      }

      case 3: {
        // Save spouse data
        const { includeSpouse, spouse } = body;
        updateData = {
          includeSpouse: includeSpouse ?? false,
        };
        if (includeSpouse && spouse) {
          updateData = {
            ...updateData,
            spouseFirstName: spouse.firstName || null,
            spouseLastName: spouse.lastName || null,
            spousePreferredName: spouse.preferredName || null,
            spouseGender: spouse.gender || null,
            spouseDob: spouse.dob ? new Date(spouse.dob) : null,
            spouseCountry: spouse.country || null,
            spouseNationality: spouse.nationality || null,
            spouseHeight: spouse.height || null,
            spouseWeight: spouse.weight || null,
            spouseOccupation: spouse.occupation || null,
            spouseOccIndustry: spouse.occupationIndustry || null,
          };
        }
        break;
      }

      case 4: {
        // Save dependant data
        const { includeDependant, dependants } = body;
        updateData = {
          includeDependant: includeDependant ?? false,
          dependantsData:
            includeDependant && dependants ? dependants : undefined,
        };
        break;
      }

      case "complete": {
        updateData = {
          onboardingComplete: true,
          status: "ACTIVE",
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid step." },
          { status: 400 }
        );
    }

    const updated = await prisma.employee.update({
      where: { id: employee.id },
      data: updateData,
    });

    return NextResponse.json({ employee: updated });
  } catch (error) {
    console.error("Onboard PUT error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
