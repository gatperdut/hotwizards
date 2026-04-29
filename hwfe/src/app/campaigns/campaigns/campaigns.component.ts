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
import { map, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
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
  public presenceService = inject(PresenceService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);

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
        this.campaignsToAdd.update((prev) => [
          campaign,
          ...prev.filter((c) => c.id !== campaignId),
        ]);
      });
    });

    this.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      this.campaignsToRemove.update((prev) => [
        campaignId,
        ...prev.filter((id) => id !== campaignId),
      ]);
    });
  }

  private membershipsListen(): void {
    this.membershipsSocket.on('downCreateMembership', (campaignId) => {
      this.campaignsApiService.get(campaignId).subscribe((campaign) => {
        if (this.campaignIds().includes(campaignId)) {
          this.campaignsToUpdate.update((prev) => [
            campaign,
            ...prev.filter((c) => c.id !== campaignId),
          ]);
        } else {
          this.campaignsToAdd.update((prev) => [
            campaign,
            ...prev.filter((c) => c.id !== campaignId),
          ]);
        }
      });
    });

    // this.membershipsSocket.on('downDeleteMembership', (campaignId) => {
    //   if (!this.campaignIds().includes(campaignId)) {
    //     return;
    //   }

    //   this.campaignsApiService.get(campaignId).subscribe((campaign) => {
    //     this.campaignsToUpdate.update((prev) => [campaign, ...prev]);
    //   });
    // });
  }
}
