import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log('[API] GET /api/employees/[id] - Request', { id });

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { quote: true, company: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Verify ownership through company
    if (employee.company.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('[API] GET /api/employees/[id] - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log('[API] PUT /api/employees/[id] - Request', { id });

    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    if (existingEmployee.company.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, email, personalizedMessage, status, planStartDate, planEndDate } =
      body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(personalizedMessage !== undefined && { personalizedMessage }),
        ...(status !== undefined && { status }),
        ...(planStartDate !== undefined && {
          planStartDate: new Date(planStartDate),
        }),
        ...(planEndDate !== undefined && {
          planEndDate: new Date(planEndDate),
        }),
      },
      include: { quote: true, company: true },
    });

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('[API] PUT /api/employees/[id] - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log('[API] DELETE /api/employees/[id] - Request', { id });

    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    if (existingEmployee.company.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error('[API] DELETE /api/employees/[id] - Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
