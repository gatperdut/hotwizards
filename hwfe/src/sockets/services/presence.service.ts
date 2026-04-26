import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HwUser } from '@hw/shared';
import { tap } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable()
export class PresenceService extends SocketService {
  private destroyRef = inject(DestroyRef);

  public online = signal(new Map<number, HwUser>());

  // TODO needs to be dropped eventually, when we don't dump the debug list somewhere
  public list = computed(() => [...this.online().values()]);

  constructor() {
    super('presence');

    this.fromEvent<HwUser>('downOnline')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((user) => {
          this.online.update((currentMap) => {
            return new Map(currentMap).set(user.id, user);
          });
        }),
      )
      .subscribe();

    this.fromEvent<HwUser[]>('downOnlineList')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((users) => {
          this.online.set(new Map(users.map((user) => [user.id, user])));
        }),
      )
      .subscribe();

    this.fromEvent<HwUser>('downOffline')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((user) => {
          this.online.update((currentMap) => {
            const newMap = new Map(currentMap);
            newMap.delete(user.id);
            return newMap;
          });
        }),
      )
      .subscribe();

    this.socket.emit('upOnline');
  }
}
