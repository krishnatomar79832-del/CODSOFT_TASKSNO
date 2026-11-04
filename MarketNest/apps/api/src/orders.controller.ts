import { Body, Controller, Get, Param, Patch, Post, BadRequestException, NotFoundException } from "@nestjs/common";
import { IsArray, IsEmail, IsIn, IsOptional, IsString, ValidateNested, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { PrismaService } from "./prisma.service";

class OrderLineDto {
  @IsString() productId: string;
  @Type(() => Number) @IsInt() @Min(1) quantity: number;
}
class CreateOrderDto {
  @IsString() customerName: string;
  @IsEmail() customerEmail: string;
  @IsOptional() @IsString() shippingAddress?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderLineDto) items: OrderLineDto[];
}
class StatusDto { @IsIn(["PLACED","CONFIRMED","PACKED","SHIPPED","DELIVERED","CANCELLED"]) status: string; }

@Controller("api/orders")
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    if (!dto.items?.length) throw new BadRequestException("Add at least one item");
    return this.prisma.$transaction(async tx => {
      const ids = [...new Set(dto.items.map(i => i.productId))];
      const products = await tx.product.findMany({ where: { id: { in: ids }, status: "ACTIVE" } });
      const byId = new Map(products.map(p => [p.id, p]));
      let total = 0;
      const lines = dto.items.map(line => {
        const p = byId.get(line.productId);
        if (!p) throw new BadRequestException("A product is unavailable");
        if (p.stock < line.quantity) throw new BadRequestException(`Not enough stock for ${p.name}`);
        total += p.price * line.quantity;
        return { productId: p.id, quantity: line.quantity, unitPrice: p.price, sellerId: p.sellerId };
      });
      for (const line of lines) await tx.product.update({ where: { id: line.productId }, data: { stock: { decrement: line.quantity } } });
      return tx.order.create({ data: {
        orderNumber: `MN-${Date.now()}`, customerName: dto.customerName,
        customerEmail: dto.customerEmail.toLowerCase(), shippingAddress: dto.shippingAddress,
        total, items: { create: lines }
      }, include: { items: { include: { product: true, seller: true } } } });
    });
  }

  @Get()
  list() { return this.prisma.order.findMany({ include: { items: { include: { product: true, seller: true } } }, orderBy: { createdAt: "desc" } }); }

  @Patch(":id/status")
  async updateStatus(@Param("id") id: string, @Body() dto: StatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found");
    return this.prisma.order.update({ where: { id }, data: { status: dto.status as any } });
  }
}
