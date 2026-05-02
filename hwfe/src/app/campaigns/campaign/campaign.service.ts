import { computed, Injectable, signal } from '@angular/core';
import { HwCampaign } from '@hw/shared';

@Injectable()
export class CampaignService {
  public campaign = signal<HwCampaign>(null!);

  public pendingMemberships = computed(() =>
    this.campaign().memberships.filter((m) => m.status === 'PENDING'),
  );

  public activeMemberships = computed(() =>
    this.campaign().memberships.filter((m) => m.status === 'ACTIVE'),
  );

  public adventure = computed(() => this.campaign().adventure);

  public activePlayer = computed(() => {
    const adventure = this.adventure();
    return adventure
      ? [this.campaign().master, ...this.campaign().memberships.map((m) => m.user)][adventure.turn]
      : undefined;
  });
}
