import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form, SchemaPath } from '@angular/forms/signals';
import { HwCampaign, HwCampaignSearchDto, PaginationMeta } from '@hw/shared';
import { map, tap } from 'rxjs';
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
  selector: 'app-my-campaigns',
  imports: [
    CampaignsFilterComponent,
    PaginatorComponent,
    CampaignComponent,
    JsonPipe,
    ButtonComponent,
  ],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private dialogService = inject(DialogService);

  constructor() {
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

  public campaigns = computed(() => this.resource.value() ?? []);

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

    void this.dialogService.open(dialog, { name: '', aoo: false, movement: 'REGULAR' });
  }
}
