import { PrismaClient } from '@hw/prismagen/client';
import { PrismaPg } from '@hw/prismagen/adapter-pg';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const connectionString: string = `${configService.get<string>('HWBE_DB_URL')}`;

    const adapter: PrismaPg = new PrismaPg({
      connectionString: connectionString,
    });

    super({ adapter: adapter });
  }
}
