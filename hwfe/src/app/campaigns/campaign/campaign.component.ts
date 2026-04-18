import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MyCampaign } from '../types/my-campaign.type';

@Component({
  selector: 'app-campaign',
  imports: [],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
  public campaign = input.required<MyCampaign>();
}
