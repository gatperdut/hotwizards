import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { CampaignService } from '../campaign.service';
import { TownMembershipComponent } from './town-membership/town-membership.component';

@Component({
  selector: 'app-town',
  imports: [ButtonComponent, TownMembershipComponent, JsonPipe],
  templateUrl: './town.component.html',
  styleUrl: './town.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownComponent {
  private campaignService = inject(CampaignService);
  private router = inject(Router);

  public memberships = computed(() => this.campaignService.campaign().memberships);

  public back(): void {
    void this.router.navigate(['home', 'campaigns']);
  }
}
