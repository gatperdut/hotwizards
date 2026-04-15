import { HealthStatus } from '@hw/shared';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public status(): HealthStatus {
    return { status: 'ok' };
  }
}
