import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HwUser, PresenceDownstream, PresenceUpstream } from '@hw/shared';
import { SocketService } from './socket.service';

@Injectable()
export class PresenceService extends SocketService<PresenceDownstream, PresenceUpstream> {
  private destroyRef = inject(DestroyRef);
  public online = signal(new Map<number, HwUser>());

  // TODO needs to be dropped eventually, when we don't dump the debug list somewhere
  public list = computed(() => [...this.online().values()]);

  constructor() {
    super('presence');

    this.fromEvent('downOnline')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.updateUser(user);
      });

    this.fromEvent('downOnlineList')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => this.initList(users));

    this.fromEvent('downOffline')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.removeUser(user.id));

    this.emit('upOnline');
  }

  private initList(users: HwUser[]): void {
    this.online.set(new Map(users.map((u) => [u.id, u])));
  }
  private updateUser(user: HwUser): void {
    this.online.update((map) => new Map(map).set(user.id, user));
  }
  private removeUser(id: number): void {
    this.online.update((map) => {
      const next = new Map(map);
      next.delete(id);
      return next;
    });
  }
}
