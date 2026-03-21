import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Super Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@localsurance.com" },
    update: {},
    create: {
      email: "admin@localsurance.com",
      passwordHash: adminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      country: "US",
      state: "CA",
      postalCode: "94102",
      jobRole: "CEO / Founder",
    },
  });
  console.log(`  Super Admin: ${superAdmin.email} (password: admin123)`);

  // Create a demo company user
  const userPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@acmecorp.com" },
    update: {},
    create: {
      email: "demo@acmecorp.com",
      passwordHash: userPassword,
      firstName: "Amir",
      lastName: "Kerim",
      role: "USER",
      phoneDialCode: "us",
      phone: "5551234567",
      country: "US",
      state: "IL",
      postalCode: "60601",
      jobRole: "HR Director",
    },
  });
  console.log(`  Demo User: ${demoUser.email} (password: demo123)`);

  // Create demo company
  const company = await prisma.company.upsert({
    where: { id: "demo-company-1" },
    update: {},
    create: {
      id: "demo-company-1",
      userId: demoUser.id,
      companyType: "Software & Design Agency",
      legalName: "Acme Corp",
      website: "https://acmecorp.com",
      phone: "+1 555-000-1234",
      addressLine: "123 Main Street",
      city: "Chicago",
      zipCode: "60601",
      country: "US",
      state: "IL",
    },
  });
  console.log(`  Company: ${company.legalName}`);

  // Create demo quote
  const quote = await prisma.quote.upsert({
    where: { id: "demo-quote-1" },
    update: {},
    create: {
      id: "demo-quote-1",
      userId: demoUser.id,
      companyId: company.id,
      selectedPlan: "medium",
      selectedRegions: ["north-central-america", "europe"],
      ageGroups: [
        { label: "0-17", range: "0-17", count: 0 },
        { label: "18-30", range: "18-30", count: 2 },
        { label: "31-45", range: "31-45", count: 3 },
        { label: "46-60", range: "46-60", count: 1 },
        { label: "61-75", range: "61-75", count: 0 },
        { label: "76+", range: "76+", count: 0 },
      ],
      costPerMember: 5200,
      totalCost: 31200,
      status: "ACTIVE",
      includesSelf: true,
    },
  });
  console.log(`  Quote: ${quote.id} (${quote.status})`);

  // Create demo employees
  const employees = [
    { fullName: "Sarah Johnson", email: "sarah@acmecorp.com", status: "ACTIVE" as const },
    { fullName: "Michael Chen", email: "michael@acmecorp.com", status: "ACTIVE" as const },
    { fullName: "Emily Davis", email: "emily@acmecorp.com", status: "ACTIVE" as const },
    { fullName: "James Wilson", email: "james@acmecorp.com", status: "PENDING" as const },
    { fullName: "Lisa Anderson", email: "lisa@acmecorp.com", status: "PENDING" as const },
    { fullName: "Robert Taylor", email: "robert@acmecorp.com", status: "CANCELED" as const },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: `demo-emp-${emp.email}` },
      update: {},
      create: {
        id: `demo-emp-${emp.email}`,
        quoteId: quote.id,
        companyId: company.id,
        fullName: emp.fullName,
        email: emp.email,
        status: emp.status,
        planStartDate: emp.status === "ACTIVE" ? new Date("2024-01-01") : null,
        planEndDate: emp.status === "ACTIVE" ? new Date("2025-01-01") : null,
      },
    });
  }
  console.log(`  Employees: ${employees.length} created`);

  // Create demo payment
  const payment = await prisma.payment.upsert({
    where: { id: "demo-payment-1" },
    update: {},
    create: {
      id: "demo-payment-1",
      quoteId: quote.id,
      amount: 31200,
      currency: "USD",
      status: "COMPLETED",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-2024-001",
      paidAt: new Date("2024-01-15"),
    },
  });
  console.log(`  Payment: $${payment.amount} (${payment.status})`);

  // Create demo invoices
  const invoices = [
    { id: "demo-inv-1", invoiceNumber: "INV-2024-0001", amount: 31200, status: "PAID" as const, dueDate: new Date("2024-02-01"), paidAt: new Date("2024-01-15") },
    { id: "demo-inv-2", invoiceNumber: "INV-2024-0002", amount: 31200, status: "UNPAID" as const, dueDate: new Date("2024-08-01"), paidAt: null },
    { id: "demo-inv-3", invoiceNumber: "INV-2024-0003", amount: 31200, status: "DRAFT" as const, dueDate: new Date("2025-02-01"), paidAt: null },
  ];

  for (const inv of invoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: {
        id: inv.id,
        quoteId: quote.id,
        companyId: company.id,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        status: inv.status,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
        coveragePlan: "Medium",
        employeeCount: 6,
      },
    });
  }
  console.log(`  Invoices: ${invoices.length} created`);

  console.log("\nSeeding complete!");
  console.log("\nLogin credentials:");
  console.log("  Super Admin: admin@localsurance.com / admin123");
  console.log("  Demo User:   demo@acmecorp.com / demo123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
