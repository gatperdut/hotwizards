import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthTokenService } from '@hw/hwfe/app/auth/services/auth-token.service';
import { environment } from '@hw/hwfe/environments/environment';
import { io, Socket } from 'socket.io-client';

export type SocketPayload = {
  adventureId?: number;
};

@Injectable({ providedIn: 'root' })
export abstract class SocketService {
  private readonly authTokenService = inject(AuthTokenService);
  protected readonly destroyRef = inject(DestroyRef);

  public socket(namespace: string, destroyRef: DestroyRef, payload?: SocketPayload): Socket {
    const socket = io(`${environment.hwbeUrl}/${namespace}`, {
      auth: (cb) => cb({ token: `Bearer ${this.authTokenService.get()}`, ...(payload || {}) }),
      autoConnect: true,
    });

    socket.on('connect_error', (err) => {
      console.error(`Connection error on namespace /${namespace}:`, err.message);
    });

    destroyRef.onDestroy(() => {
      socket.disconnect();
    });

    return socket;
  }
}
