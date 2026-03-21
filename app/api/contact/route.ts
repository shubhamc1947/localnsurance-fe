import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, bestTime, message } = await request.json();
    console.log(`[API] POST /api/contact - name: ${name}, email: ${email}`);

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const contactQuery = await prisma.contactQuery.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        bestTime: bestTime || undefined,
        message: message || undefined,
      },
    });

    console.log(`[API] Contact query created: ${contactQuery.id}`);

    return NextResponse.json(
      { success: true, message: "Your query has been submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/contact - Error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact query" },
      { status: 500 }
    );
  }
}
