import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { PanzoomDirective } from './directives/panzoom.directive';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-board',
  imports: [PanzoomDirective, SidebarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  public campaignService = inject(CampaignService);

  public tiles: number[] = Array.from({ length: 375 }, (_, i) => i);
}
