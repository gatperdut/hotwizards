import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form, SchemaPath } from '@angular/forms/signals';
import { PresenceService } from '@hw/hwfe/app/presence/presence.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  CampaignsDownstream,
  CampaignsUpstream,
  HwCampaign,
  HwCampaignSearchDto,
  MembershipsDownstream,
  MembershipsUpstream,
} from '@hw/shared';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { UserMenuComponent } from '../../shared/user-menu/user-menu.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
import { ToastService } from '../../ui/toast/services/toast.service';
import {
  CampaignEditorDialogComponent,
  CampaignEditorDialogData,
  CampaignEditorDialogResult,
} from '../campaign-editor-dialog/campaign-editor-dialog.component';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { CampaignsListEntryComponent } from './campaigns-list-entry/campaigns-list-entry.component';
import { CampaignsListFilterComponent } from './campaigns-list-filter/campaigns-list-filter.component';
import { CampaignsListActionsService } from './services/campaigns-list-actions.service';

@Component({
  selector: 'app-campaigns',
  imports: [
    CampaignsListFilterComponent,
    PaginatorComponent,
    CampaignsListEntryComponent,
    ButtonComponent,
    UserMenuComponent,
  ],
  templateUrl: './campaigns-list.component.html',
  styleUrl: './campaigns-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CampaignsListActionsService],
})
export class CampaignsListComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private dialogService = inject(DialogService);
  public presenceService = inject(PresenceService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  private campaignsSocket!: Socket<CampaignsDownstream, CampaignsUpstream>;
  private membershipsSocket!: Socket<MembershipsDownstream, MembershipsUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.membershipsSocket = this.socketService.socket('memberships', this.destroyRef);

    this.campaignsListen();
    this.membershipsListen();

    effect(() => {
      this.model();
      this.page.set(0);
    });
  }

  public model = signal<HwCampaignSearchDto>({
    term: '',
  });

  public form = form(this.model, (schemaPath) => {
    debounce(schemaPath.term as SchemaPath<string>, 400);
  });

  public page = signal<number>(0);

  public pages = signal<number>(0);

  private resource = rxResource<HwCampaign[], HwCampaignSearchDto>({
    params: () => ({ ...this.model(), page: this.page() }),
    stream: (request) =>
      this.campaignsApiService.search(request.params).pipe(
        tap((response) => {
          this.pages.set(response.meta.pages);
        }),
        map((response) => response.items),
      ),
  });

  public campaigns = computed(() => this.resource.value() || []);

  public loading = computed(() => this.resource.isLoading());

  public create(): void {
    const dialog: LazyDialog<
      CampaignEditorDialogComponent,
      CampaignEditorDialogData,
      CampaignEditorDialogResult
    > = {
      importFn: () =>
        import('../campaign-editor-dialog/campaign-editor-dialog.component').then(
          (m) => m.CampaignEditorDialogComponent,
        ),
    };

    void this.dialogService.open(dialog, { dto: { name: '', aoo: false, movement: 'REGULAR' } });
  }

  private addToResource(campaign: HwCampaign): void {
    this.resource.value.update((prev) => [campaign, ...(prev ?? [])]);
  }

  private updateResource(campaign: HwCampaign): void {
    this.resource.value.update(
      (prev) => prev?.map((c) => (c.id === campaign.id ? campaign : c)) ?? [],
    );
  }

  private removeFromResource(campaignId: number): void {
    this.resource.value.set(this.resource.value()?.filter((c) => c.id !== campaignId) ?? []);
  }

  private campaignsListen(): void {
    this.campaignsSocket.on('downCreateCampaign', (campaignId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.addToResource(campaign);
      });
    });

    this.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      this.removeFromResource(campaignId);
      this.resource.value.set(this.resource.value()?.filter((c) => c.id !== campaignId) ?? []);
    });

    this.campaignsSocket.on('downUpdateCampaign', (campaignId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.updateResource(campaign);
      });
    });
  }

  private membershipsListen(): void {
    this.membershipsSocket.on('downCreateMembership', (campaignId, membershipIds) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        const memberships = campaign.memberships.filter(
          (m) => m.me && membershipIds.includes(m.id),
        );

        if (memberships.length) {
          this.addToResource(campaign);
          this.toastService.show({
            message: `${campaign.master.handle} has invited you to ${campaign.name}`,
          });
        } else {
          this.updateResource(campaign);
        }
      });
    });

    this.membershipsSocket.on('downKickoutMembership', (campaignId, campaignName, masterHandle) => {
      this.campaignsApiService
        .get(campaignId)
        .pipe(
          catchError(() => {
            this.toastService.show({
              message: `${masterHandle} has kicked you out of ${campaignName}`,
            });

            this.removeFromResource(campaignId);

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.updateResource(campaign);
        });
    });

    this.membershipsSocket.on('downAbandonMembership', (campaignId, memberHandle) => {
      this.campaignsApiService
        .get(campaignId)
        .pipe(
          catchError(() => {
            this.removeFromResource(campaignId);

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.updateResource(campaign);

          if (campaign.master.me) {
            this.toastService.show({
              message: `${memberHandle} has abandoned ${campaign.name}`,
            });
          }
        });
    });

    this.membershipsSocket.on('downUpdateMembership', (campaignId, membershipId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.updateResource(campaign);

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
}
