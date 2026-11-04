import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { HealthController } from "./health.controller";
import { ProductsController } from "./products.controller";
import { SellersController } from "./sellers.controller";
import { OrdersController } from "./orders.controller";
import { CategoriesController } from "./categories.controller";

@Module({
  controllers: [HealthController, ProductsController, SellersController, OrdersController, CategoriesController],
  providers: [PrismaService]
})
export class AppModule {}
