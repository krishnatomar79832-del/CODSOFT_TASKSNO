import { Body, Controller, Get, Param, Post, NotFoundException } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";
import { PrismaService } from "./prisma.service";

class CreateSellerDto {
  @IsString() storeName: string;
  @IsString() ownerName: string;
  @IsEmail() email: string;
}
@Controller("api/sellers")
export class SellersController {
  constructor(private prisma: PrismaService) {}
  @Get()
  list() { return this.prisma.seller.findMany({ include: { _count: { select: { products: true } } }, orderBy: { createdAt: "desc" } }); }
  @Get(":id")
  async detail(@Param("id") id: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id }, include: { products: true } });
    if (!seller) throw new NotFoundException("Seller not found");
    return seller;
  }
  @Post()
  create(@Body() dto: CreateSellerDto) {
    return this.prisma.seller.create({ data: { ...dto, email: dto.email.toLowerCase() } });
  }
}
