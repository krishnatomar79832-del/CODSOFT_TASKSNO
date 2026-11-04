import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@edumanage.local" },
    update: {},
    create: { name: "System Admin", email: "admin@edumanage.local", passwordHash, role: Role.ADMIN }
  });
  console.log("Admin login: admin@edumanage.local / Admin@12345");
}
main().finally(async () => prisma.$disconnect());
