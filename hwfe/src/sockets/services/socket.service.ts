import { inject } from '@angular/core';
import { AuthTokenService } from '@hw/hwfe/app/auth/services/auth-token.service';
import { environment } from '@hw/hwfe/environments/environment';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export abstract class SocketService<
  Downstream extends Record<string, any>,
  Upstream extends Record<string, any>,
> {
  protected socket!: Socket;
  private authTokenService = inject(AuthTokenService);

  constructor(protected namespace: string) {
    this.connect();
  }

  private connect(): void {
    const token = this.authTokenService.get();

    this.socket = io(`${environment.hwbeUrl}/${this.namespace}`, {
      auth: {
        token: `Bearer ${token}`,
      },
      autoConnect: true,
    });

    this.socket.on('connect_error', (err) => {
      console.error(`Connection error on namespace ${this.namespace}:`, err.message);
    });
  }

  protected fromEvent<K extends keyof Downstream & string>(
    eventName: K,
  ): Observable<Parameters<Downstream[K]>[0]> {
    return new Observable((observer) => {
      const listener = (data: any): void => observer.next(data);

      this.socket.on(eventName as string, listener as (...args: any[]) => void);

      return () => {
        this.socket.off(eventName as string, listener as (...args: any[]) => void);
      };
    });
  }

  protected emit<K extends keyof Upstream & string>(
    eventName: K,
    ...args: Parameters<Upstream[K]>
  ): void {
    this.socket.emit(eventName, ...args);
  }

  protected disconnect(): void {
    this.socket.disconnect();
  }
}
