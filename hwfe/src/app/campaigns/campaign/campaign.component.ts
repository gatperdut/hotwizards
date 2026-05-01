import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CampaignService } from './campaign.service';

@Component({
  selector: 'app-campaign',
  imports: [RouterOutlet],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
  private activatedRoute = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);

  constructor() {
    this.campaignService.campaign.set(this.activatedRoute.snapshot.data['campaign']);
  }
}
