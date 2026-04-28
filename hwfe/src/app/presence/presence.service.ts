import { computed, Injectable, signal } from '@angular/core';
import { HwUser } from '@hw/shared';

@Injectable()
export class PresenceService {
  public readonly online = signal(new Map<number, HwUser>());

  // TODO needs to be dropped eventually, when we don't dump the debug list somewhere
  public readonly list = computed(() => [...this.online().values()]);
}
