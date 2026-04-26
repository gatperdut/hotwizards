// socket-data.d.ts

import { HwUser } from '@hw/shared';

declare module 'socket.io' {
  interface Socket<ListenEvents, EmitEvents, ServerSideEvents, SocketData> {
    user: HwUser;
  }
}
