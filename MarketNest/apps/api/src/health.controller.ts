import { Controller, Get } from "@nestjs/common";
@Controller("api/health")
export class HealthController {
  @Get()
  health() { return { status: "ok", service: "MarketNest API", timestamp: new Date().toISOString() }; }
}
