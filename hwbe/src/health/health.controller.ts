import { HwHealthStatus } from '@hw/shared';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public status(): HwHealthStatus {
    return { status: 'ok' };
  }
}
