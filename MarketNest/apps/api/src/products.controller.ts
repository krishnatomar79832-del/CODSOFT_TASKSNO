import { Body, Controller, Get, Param, Post, Query, BadRequestException, NotFoundException } from "@nestjs/common";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { PrismaService } from "./prisma.service";

class CreateProductDto {
  @IsString() name: string;
  @IsString() description: string;
  @Type(() => Number) @IsNumber() @Min(0.01) price: number;
  @IsString() categoryId: string;
  @IsString() sellerId: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock?: number;
}
@Controller("api/products")
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query("q") q?: string, @Query("category") category?: string) {
    return this.prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}),
        ...(category ? { categoryId: category } : {})
      },
      include: { seller: { select: { id: true, storeName: true } }, category: true },
      orderBy: { createdAt: "desc" }
    });
  }

  @Get(":id")
  async detail(@Param("id") id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { seller: true, category: true } });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const [seller, category] = await Promise.all([
      this.prisma.seller.findUnique({ where: { id: dto.sellerId } }),
      this.prisma.category.findUnique({ where: { id: dto.categoryId } })
    ]);
    if (!seller || !category) throw new BadRequestException("Valid sellerId and categoryId are required");
    return this.prisma.product.create({ data: {
      name: dto.name, description: dto.description, price: dto.price,
      sellerId: dto.sellerId, categoryId: dto.categoryId,
      imageUrl: dto.imageUrl, stock: dto.stock ?? 0
    }, include: { seller: true, category: true } });
  }
}
