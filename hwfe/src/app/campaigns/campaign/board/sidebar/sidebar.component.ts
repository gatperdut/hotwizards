import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { CampaignsApiService } from '../../../services/campaigns-api.service';
import { CampaignService } from '../../campaign.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public campaignService = inject(CampaignService);
  private campaignsApiService = inject(CampaignsApiService);

  public logout(): void {
    this.authService.logout();
  }

  public toHome(): void {
    void this.router.navigate(['home']);
  }

  public back(): void {
    void this.router.navigate(['home', 'campaigns']);
  }

  public pass(): void {}

  public finish(): void {
    this.campaignsApiService.finishAdventure(this.campaignService.campaign().id).subscribe();
  }
}
