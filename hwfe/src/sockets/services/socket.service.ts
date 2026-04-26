import { inject } from '@angular/core';
import { AuthTokenService } from '@hw/hwfe/app/auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export abstract class SocketService {
  protected socket!: Socket;
  private authTokenService = inject(AuthTokenService);

  constructor(protected namespace: string) {
    this.connect();
  }

  private connect(): void {
    const token = this.authTokenService.get();

    this.socket = io(`http://localhost:3000/${this.namespace}`, {
      auth: {
        token: `Bearer ${token}`,
      },
      autoConnect: true,
    });

    this.socket.on('connect_error', (err) => {
      console.error(`Connection error on namespace ${this.namespace}:`, err.message);
    });
  }

  protected fromEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(eventName, (data: T) => observer.next(data));
      return () => this.socket.off(eventName);
    });
  }

  protected disconnect(): void {
    this.socket.disconnect();
  }
}
