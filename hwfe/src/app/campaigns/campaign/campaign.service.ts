import { computed, Injectable, signal } from '@angular/core';
import { HwCampaign } from '@hw/shared/campaigns';

@Injectable()
export class CampaignService {
  public campaign = signal<HwCampaign>(null!);

  public master = computed(() => this.campaign().master);

  public memberships = computed(() => this.campaign().memberships);

  public myMembership = computed(() => this.memberships().find((m) => m.me));

  public me = computed(() => (this.master().me ? this.master() : this.myMembership()!.user));

  public pendingMemberships = computed(() =>
    this.memberships().filter((m) => m.status === 'PENDING'),
  );

  public activeMemberships = computed(() =>
    this.memberships().filter((m) => m.status === 'ACTIVE'),
  );
}
