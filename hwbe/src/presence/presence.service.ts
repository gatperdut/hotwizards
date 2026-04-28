import { Injectable } from '@nestjs/common';
import { HwUser } from '../../../shared/dist/shared/src/users/user.interface.js';

@Injectable()
export class PresenceService {
  public readonly online = new Map<number, HwUser>();
  public readonly sessions = new Map<number, Set<string>>();
}
