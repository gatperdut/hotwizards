import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
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
  PaginationMeta,
} from '@hw/shared';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { AuthService } from '../../auth/services/auth.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
import { ToastService } from '../../ui/toast/services/toast.service';
import {
  CampaignEditorDialogComponent,
  CampaignEditorDialogData,
  CampaignEditorDialogResult,
} from '../campaign-editor-dialog/campaign-editor-dialog.component';
import { CampaignComponent } from '../campaign/campaign.component';
import { CampaignsFilterComponent } from '../campaigns-filter/campaigns-filter.component';
import { CampaignsApiService } from '../services/campaigns-api.service';

@Component({
  selector: 'app-campaigns',
  imports: [
    CampaignsFilterComponent,
    PaginatorComponent,
    CampaignComponent,
    JsonPipe,
    ButtonComponent,
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
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

  public meta = signal<PaginationMeta>({
    page: 0,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  private resource = rxResource<HwCampaign[], HwCampaignSearchDto>({
    params: () => ({ ...this.model(), page: this.page() }),
    stream: (request) =>
      this.campaignsApiService.search(request.params).pipe(
        tap((response) => {
          this.meta.set(response.meta);
          this.pages.set(response.meta.pages);
        }),
        map((response) => response.items),
      ),
  });

  public campaigns = computed(() => {
    const updateMap = new Map(this.campaignsToUpdate().map((c) => [c.id, c]));

    const result = [...this.campaignsToAdd(), ...(this.resource.value() ?? [])]
      .filter((campaign) => !this.campaignsToRemove().includes(campaign.id))
      .map((campaign) => updateMap.get(campaign.id) ?? campaign);

    untracked(() => {
      this.campaignsToAdd.set([]);
      this.campaignsToRemove.set([]);
      this.campaignsToUpdate.set([]);
    });

    return result;
  });

  public campaignIds = computed(() => this.campaigns().map((c) => c.id));

  private campaignsToAdd = signal<HwCampaign[]>([]);
  private campaignsToRemove = signal<number[]>([]);
  private campaignsToUpdate = signal<HwCampaign[]>([]);

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

  private campaignsListen(): void {
    this.campaignsSocket.on('downCreateCampaign', (campaignId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.campaignsToAdd.update((prev) => [campaign, ...prev]);
      });
    });

    this.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      if (!this.campaignIds().includes(campaignId)) {
        return;
      }
      this.campaignsToRemove.update((prev) => [campaignId, ...prev]);
    });

    this.campaignsSocket.on('downUpdateCampaign', (campaignId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        if (!this.campaignIds().includes(campaignId)) {
          return;
        }
        this.campaignsToUpdate.update((prev) => [campaign, ...prev]);
      });
    });
  }

  private membershipsListen(): void {
    this.membershipsSocket.on('downCreateMembership', (campaignId, membershipIds) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        const memberships = campaign.memberships.filter((m) => membershipIds.includes(m.id));

        const oneIsMine = !!memberships.filter((m) => m.me).length;

        if (oneIsMine) {
          this.campaignsToAdd.update((prev) => [campaign, ...prev]);
          this.toastService.show({
            message: `${campaign.master.handle} has invited you to ${campaign.name}`,
          });
        } else {
          if (!this.campaignIds().includes(campaignId)) {
            return;
          }
          this.campaignsToUpdate.update((prev) => [campaign, ...prev]);
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

            if (this.campaignIds().includes(campaignId)) {
              this.campaignsToRemove.update((prev) => [campaignId, ...prev]);
            }

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          if (this.campaignIds().includes(campaignId)) {
            this.campaignsToUpdate.update((prev) => [campaign, ...prev]);
          }
        });
    });

    this.membershipsSocket.on('downAbandonMembership', (campaignId, memberHandle) => {
      this.campaignsApiService
        .get(campaignId)
        .pipe(
          catchError(() => {
            if (this.campaignIds().includes(campaignId)) {
              if (this.campaignIds().includes(campaignId)) {
                this.campaignsToRemove.update((prev) => [campaignId, ...prev]);
              }
            }

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          if (this.campaignIds().includes(campaignId)) {
            this.campaignsToUpdate.update((prev) => [campaign, ...prev]);
          }

          if (campaign.master.me) {
            this.toastService.show({
              message: `${memberHandle} has abandoned ${campaign.name}`,
            });
          }
        });
    });

    this.membershipsSocket.on('downUpdateMembership', (campaignId, membershipId) => {
      if (!this.campaignIds().includes(campaignId)) {
        return;
      }

      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        this.campaignsToUpdate.update((prev) => [campaign, ...prev]);

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
