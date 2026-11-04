import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
@Controller("api/categories")
export class CategoriesController {
  constructor(private prisma: PrismaService) {}
  @Get()
  list() { return this.prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }); }
}
