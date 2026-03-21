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
    const { quoteId, amount, paymentMethod } = body;

    if (!quoteId || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "quoteId and amount are required" },
        { status: 400 }
      );
    }

    // Verify the quote belongs to the user
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { company: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate invoice number: INV-YYYY-XXXX
    const now = new Date();
    const year = now.getFullYear();
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${year}-${String(invoiceCount + 1).padStart(4, "0")}`;

    // Process payment, update quote, and create invoice in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment record with COMPLETED status
      const payment = await tx.payment.create({
        data: {
          quoteId,
          amount,
          paymentMethod: paymentMethod ?? undefined,
          status: "COMPLETED",
          paidAt: now,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        },
      });

      // Update quote status to ACTIVE
      await tx.quote.update({
        where: { id: quoteId },
        data: { status: "ACTIVE" },
      });

      // Generate invoice
      const invoice = await tx.invoice.create({
        data: {
          quoteId,
          companyId: quote.companyId!,
          invoiceNumber,
          amount,
          status: "PAID",
          paidAt: now,
          coveragePlan: quote.selectedPlan ?? undefined,
        },
        include: { quote: true, company: true },
      });

      return { payment, invoice };
    });

    return NextResponse.json(
      { payment: result.payment, invoice: result.invoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
