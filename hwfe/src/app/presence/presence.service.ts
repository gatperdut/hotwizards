import { Injectable, signal } from '@angular/core';
import { HwUser } from '@hw/shared/users';

@Injectable()
export class PresenceService {
  public readonly online = signal(new Map<number, HwUser>());
}
