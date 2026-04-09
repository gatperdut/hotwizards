import { HealthStatusDto } from '@hw/shared';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public status(): HealthStatusDto {
    return { status: 'ok' };
  }
}
