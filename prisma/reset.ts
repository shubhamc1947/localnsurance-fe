import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting database...\n");

  // Delete in order (respect foreign keys)
  const deleted = await prisma.$transaction([
    prisma.dependantInfo.deleteMany(),
    prisma.spouseInfo.deleteMany(),
    prisma.planholderInfo.deleteMany(),
    prisma.parentInfo.deleteMany(),
    prisma.supportTicket.deleteMany(),
    prisma.otpCode.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.company.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("  All tables cleared.");

  // Re-create super admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@localsurance.com",
      passwordHash: adminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      country: "US",
      state: "CA",
      postalCode: "94102",
      jobRole: "Platform Administrator",
    },
  });

  console.log(`  Super Admin created: ${superAdmin.email}`);
  console.log("\n--- Database Reset Complete ---");
  console.log("\nLogin credentials:");
  console.log("  Super Admin: admin@localsurance.com / admin123");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
