import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { CampaignsDownstream, CampaignsUpstream } from '@hw/shared';
import { tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CampaignsApiService } from '../../services/campaigns-api.service';
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
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private campaignService = inject(CampaignService);
  private campaignsApiService = inject(CampaignsApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public tiles: number[] = Array.from({ length: 375 }, (_, i) => i);

  private campaignsSocket!: Socket<CampaignsDownstream, CampaignsUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);

    this.campaignsListen();
  }

  private campaignsListen(): void {
    this.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.toastService.show({
        message: `Campaign ${this.campaignService.campaign().name} has been deleted`,
      });

      void this.router.navigate(['home', 'campaigns']);
    });

    this.campaignsSocket.on('downFinishAdventure', (campaignId, adventureTemplateName) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.campaignsApiService
        .get(campaignId)
        .pipe(
          tap((campaign) => {
            this.campaignService.campaign.set(campaign);

            this.toastService.show({
              message: `The adventure ${adventureTemplateName} has finished`,
            });

            void this.router.navigate(['home', 'campaigns', campaignId, 'town']);
          }),
        )
        .subscribe();
    });
  }
}
