import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  public createIOServer(port: number, options: ServerOptions): any {
    const configService = this.app.get(ConfigService);
    const origin = configService.get<string>('HWBE_CORS_ORIGIN');

    const optionsWithCors: ServerOptions = {
      ...options,
      cors: {
        origin: origin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    const server = super.createIOServer(port, optionsWithCors);
    return server;
  }
}
