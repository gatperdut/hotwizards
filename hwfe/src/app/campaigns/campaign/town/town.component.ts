import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WhoComponent } from '@hw/hwfe/app/shared/who/who.component';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  CampaignsDownstream,
  CampaignsUpstream,
  HwCampaign,
  MembershipsDownstream,
  MembershipsUpstream,
} from '@hw/shared';
import { catchError, EMPTY, of, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CampaignsApiService } from '../../services/campaigns-api.service';
import { CampaignService } from '../campaign.service';
import { AdventurePickerComponent } from './adventure-picker/adventure-picker.component';
import { TownMembershipComponent } from './town-membership/town-membership.component';

@Component({
  selector: 'app-town',
  imports: [ButtonComponent, TownMembershipComponent, WhoComponent, AdventurePickerComponent],
  templateUrl: './town.component.html',
  styleUrl: './town.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownComponent {
  public campaignService = inject(CampaignService);
  private router = inject(Router);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private campaignsApiService = inject(CampaignsApiService);

  private campaignsSocket!: Socket<CampaignsDownstream, CampaignsUpstream>;
  private membershipsSocket!: Socket<MembershipsDownstream, MembershipsUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.membershipsSocket = this.socketService.socket('memberships', this.destroyRef);

    this.campaignsListen();
    this.membershipsListen();
  }

  private campaignsListen(): void {
    this.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.toastService.show({
        message: `Campaign ${this.campaignService.campaign().name} has been deleted`,
      });
      this.back();
    });

    this.campaignsSocket.on('downUpdateCampaign', (campaignId) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.refresh();
    });

    this.campaignsSocket.on('downStartAdventure', (campaignId, adventureTemplateName) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.campaignsApiService
        .get(campaignId)
        .pipe(
          tap((campaign) => {
            this.campaignService.campaign.set(campaign);

            this.toastService.show({
              message: `The adventure has started: ${adventureTemplateName}`,
            });
            void this.router.navigate([
              'home',
              'campaigns',
              this.campaignService.campaign().id,
              'board',
            ]);
          }),
        )
        .subscribe();
    });
  }

  private membershipsListen(): void {
    this.membershipsSocket.on('downCreateMembership', (campaignId, _membershipIds) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.refresh();
    });

    this.membershipsSocket.on('downKickoutMembership', (campaignId, campaignName, masterHandle) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.campaignsApiService
        .get(campaignId)
        .pipe(
          catchError(() => {
            this.toastService.show({
              message: `${masterHandle} has kicked you out of ${campaignName}`,
            });

            this.back();

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.refresh(campaign);
        });
    });

    this.membershipsSocket.on('downAbandonMembership', (campaignId, memberHandle) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.campaignsApiService
        .get(campaignId)
        .pipe(
          catchError(() => {
            this.back();

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.refresh(campaign);

          if (campaign.master.me) {
            this.toastService.show({
              message: `${memberHandle} has abandoned ${campaign.name}`,
            });
          }
        });
    });

    this.membershipsSocket.on('downUpdateMembership', (campaignId, membershipId) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.refresh(campaign);

        if (campaign.master.me) {
          const membership = campaign.memberships.find((m) => m.id === membershipId);

          if (!membership) {
            return;
          }

          this.toastService.show({
            message: `${membership.user.handle} has joined your campaign ${campaign.name}`,
          });
        }
      });
    });
  }

  private refresh(campaign?: HwCampaign): void {
    (campaign
      ? of(campaign)
      : this.campaignsApiService.get(this.campaignService.campaign().id)
    ).subscribe((campaign) => {
      this.campaignService.campaign.set(campaign);
    });
  }

  public back(): void {
    void this.router.navigate(['home', 'campaigns']);
  }
}
