import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      companyType,
      legalName,
      website,
      phone,
      addressLine,
      city,
      zipCode,
      country,
      state,
    } = body;

    if (!legalName) {
      return NextResponse.json(
        { error: "legalName is required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        userId: user.userId as string,
        companyType: companyType ?? undefined,
        legalName,
        website: website ?? undefined,
        phone: phone ?? undefined,
        addressLine: addressLine ?? undefined,
        city: city ?? undefined,
        zipCode: zipCode ?? undefined,
        country: country ?? undefined,
        state: state ?? undefined,
      },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
