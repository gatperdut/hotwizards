import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CharactersController } from './characters.controller.js';
import { CharactersService } from './characters.service.js';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
  imports: [PrismaModule],
  exports: [CharactersService],
})
export class CharactersModule {}
