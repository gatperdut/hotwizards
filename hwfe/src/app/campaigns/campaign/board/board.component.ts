import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  AdventuresDownstream,
  AdventuresUpstream,
  CampaignsDownstream,
  CampaignsUpstream,
} from '@hw/shared';
import { tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { PanzoomDirective } from '../../../shared/panzoom.directive';
import { CampaignsApiService } from '../../services/campaigns-api.service';
import { CampaignService } from '../campaign.service';
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
  private adventuresSocket!: Socket<AdventuresDownstream, AdventuresUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.adventuresSocket = this.socketService.socket('adventures', this.destroyRef, {
      adventureId: this.campaignService.adventure()!.id,
    });

    this.campaignsListen();
    this.adventuresListen();
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
  }

  private adventuresListen(): void {
    this.adventuresSocket.on('downFinishAdventure', (campaignId, adventureTemplateName) => {
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

    this.adventuresSocket.on('downNextTurn', (campaignId, turn) => {
      this.campaignsApiService
        .get(campaignId)
        .pipe(
          tap((campaign) => {
            this.campaignService.campaign.set(campaign);

            let message: string;

            if (turn === 0) {
              const master = this.campaignService.master();

              message = master.me
                ? 'Your turn, Zargon'
                : `Turn for Zargon (${this.campaignService.master().handle})`;
            } else {
              const membership = this.campaignService.memberships()[turn - 1];

              message = membership.me
                ? `Your turn, ${membership.character!.name}`
                : `Turn for ${membership.character!.name} (${membership.user.handle})`;
            }
            this.toastService.show({
              message: message,
            });
          }),
        )
        .subscribe();
    });
  }
}
