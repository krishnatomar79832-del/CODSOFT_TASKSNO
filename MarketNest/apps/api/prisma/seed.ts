import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const categories = ["Electronics", "Fashion", "Home & Living", "Books"];
  const categoryRows = [];
  for (const name of categories) categoryRows.push(await prisma.category.upsert({ where: { name }, update: {}, create: { name } }));
  const seller = await prisma.seller.upsert({
    where: { email: "seller@marketnest.local" }, update: {},
    create: { storeName: "Demo Store", ownerName: "Demo Seller", email: "seller@marketnest.local", status: "APPROVED" }
  });
  const samples = [
    ["Wireless Headphones", "Comfortable wireless headphones with clear sound.", 1499, 18, 0],
    ["Everyday Backpack", "Durable backpack for college and travel.", 899, 25, 1],
    ["Desk Lamp", "Adjustable LED desk lamp for work and study.", 699, 14, 2],
    ["Web Development Guide", "Beginner-friendly guide to modern web development.", 499, 30, 3]
  ] as const;
  for (const [name, description, price, stock, index] of samples) {
    const existing = await prisma.product.findFirst({ where: { name, sellerId: seller.id } });
    if (!existing) await prisma.product.create({ data: { name, description, price, stock, sellerId: seller.id, categoryId: categoryRows[index].id } });
  }
  console.log("Seeded demo seller, categories and products.");
}
main().finally(() => prisma.$disconnect());
