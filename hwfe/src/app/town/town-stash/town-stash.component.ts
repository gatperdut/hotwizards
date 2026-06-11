import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CardComponent } from '@hw/hwfe/app/ui/card/card.component';
import { HwItem } from '@hw/shared/inventory';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { BackpackManagerComponent } from '../../inventory/inventory-manager/backpack-manager/backpack-manager.component';

@Component({
  selector: 'app-town-stash',
  imports: [CardComponent, BackpackManagerComponent],
  templateUrl: './town-stash.component.html',
  styleUrl: './town-stash.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownStashComponent {
  private campaignService = inject(CampaignService);

  public pickup = output<HwItem>();
  public pickupGold = output<number>();
  public dropGold = output<number>();

  public stash = computed(() => this.campaignService.stash());
  private membership = computed(() => this.campaignService.myMembership());
  public character = computed(() => (this.membership() ? this.membership()!.character! : null));
  public master = computed(() => this.campaignService.master());
}
