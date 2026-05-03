import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CharactersController } from './characters.controller.js';
import { CharactersService } from './characters.service.js';
import { KlassesService } from './klasses.service.js';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, KlassesService],
  imports: [PrismaModule],
  exports: [KlassesService],
})
export class CharactersModule {}
