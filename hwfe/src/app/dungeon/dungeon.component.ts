import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  AdventuresDownstream,
  AdventuresUpstream,
  CampaignsDownstream,
  CampaignsUpstream,
} from '@hw/shared/sockets';
import { forkJoin, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import { DungeonService } from './services/dungeon.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-dungeon',
  imports: [SidebarComponent],
  templateUrl: './dungeon.component.html',
  styleUrl: './dungeon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverflowService, DungeonService, ViewportService, TextureService],
})
export class DungeonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private campaignService = inject(CampaignService);
  private campaignsApiService = inject(CampaignsApiService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private overflowService = inject(OverflowService);
  private dungeonService = inject(DungeonService);
  private viewportService = inject(ViewportService);
  private textureService = inject(TextureService);

  private campaignsSocket!: Socket<CampaignsDownstream, CampaignsUpstream>;
  private adventuresSocket!: Socket<AdventuresDownstream, AdventuresUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.adventuresSocket = this.socketService.socket('adventures', this.destroyRef, {
      adventureId: this.campaignService.campaign().adventure!.id,
    });

    this.campaignsListen();
    this.adventuresListen();
  }

  public ngAfterViewInit(): void {
    void this.init();
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }

  private init(): void {
    this.overflowService.hide();

    forkJoin([this.textureService.setup(), this.viewportService.setup(this.canvasRef)])
      .pipe(
        tap(() => {
          this.dungeonService.setup(this.campaignService.campaign().adventure!);
        }),
        tap(() => {
          this.viewportService.viewport.setZoom(3);
          this.viewportService.center(14, 11);
        }),
      )
      .subscribe();
  }

  // TODO should this be dealt with in campaign.service?
  // Later thoughts: I think it makes sense here? To begin with, it shouldn't be dealt with in a service?
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
