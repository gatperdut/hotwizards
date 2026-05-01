import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-campaign',
  imports: [RouterOutlet],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {}
