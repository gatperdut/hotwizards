import { DestroyRef, inject } from '@angular/core';
import { AuthTokenService } from '@hw/hwfe/app/auth/services/auth-token.service';
import { environment } from '@hw/hwfe/environments/environment';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export abstract class SocketService<
  Downstream extends Record<string, any>,
  Upstream extends Record<string, any>,
> {
  private readonly authTokenService = inject(AuthTokenService);
  protected readonly destroyRef = inject(DestroyRef);

  private socket!: Socket<Downstream, Upstream>;

  constructor(private readonly namespace: string) {
    this.connect();

    this.destroyRef.onDestroy(() => this.disconnect());
  }

  private connect(): void {
    this.socket = io(`${environment.hwbeUrl}/${this.namespace}`, {
      auth: (cb) => cb({ token: `Bearer ${this.authTokenService.get()}` }),
      autoConnect: true,
    });

    this.socket.on('connect_error', (err) => {
      console.error(`Connection error on namespace ${this.namespace}:`, err.message);
    });
  }

  protected fromEvent<K extends keyof Downstream>(
    eventName: K,
  ): Observable<Parameters<Downstream[K]>[0]> {
    return new Observable((observer) => {
      const listener = (data: any): void => observer.next(data);

      (this.socket as Socket).on(eventName as string, listener as (...args: any[]) => void);

      return () => {
        (this.socket as Socket).off(eventName as string, listener as (...args: any[]) => void);
      };
    });
  }

  protected emit<K extends keyof Upstream>(eventName: K, ...args: Parameters<Upstream[K]>): void {
    this.socket.emit(eventName as string, ...(args as Parameters<Upstream[string]>));
  }

  private disconnect(): void {
    this.socket.disconnect();
  }
}
