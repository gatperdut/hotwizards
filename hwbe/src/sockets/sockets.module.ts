import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PresenceGateway } from './presence.gateway.js';

@Module({
  providers: [PresenceGateway],
  imports: [AuthModule],
})
export class SocketsModule {}
