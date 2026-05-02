import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form, SchemaPath } from '@angular/forms/signals';
import { AdventureTemplatesApiService } from '@hw/hwfe/app/adventure-templates/services/adventure-templates-api.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '@hw/hwfe/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { DialogService, LazyDialog } from '@hw/hwfe/app/ui/dialog/services/dialog.service';
import { PaginatorComponent } from '@hw/hwfe/app/ui/paginator/paginator.component';
import { HwAdventureTemplate, HwAdventureTemplateSearchDto } from '@hw/shared';
import { filter, map, tap } from 'rxjs';
import { CampaignService } from '../../campaign.service';
import { AdventurePickerFilterComponent } from './adventure-picker-filter/adventure-picker-filter.component';

@Component({
  selector: 'app-adventure-picker',
  imports: [PaginatorComponent, AdventurePickerFilterComponent, ButtonComponent],
  templateUrl: './adventure-picker.component.html',
  styleUrl: './adventure-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventurePickerComponent {
  public campaignService = inject(CampaignService);
  private adventureTemplatesApiService = inject(AdventureTemplatesApiService);
  private dialogService = inject(DialogService);

  public master = input.required<boolean>();

  constructor() {
    effect(() => {
      this.model();
      this.page.set(0);
    });
  }

  public model = signal<HwAdventureTemplateSearchDto>({
    term: '',
  });

  public form = form(this.model, (schemaPath) => {
    debounce(schemaPath.term as SchemaPath<string>, 400);
  });

  public page = signal<number>(0);

  public pages = signal<number>(0);

  private resource = rxResource<HwAdventureTemplate[], HwAdventureTemplateSearchDto>({
    params: () => ({ ...this.model(), page: this.page() }),
    stream: (request) =>
      this.adventureTemplatesApiService.search(request.params).pipe(
        tap((response) => {
          this.pages.set(response.meta.pages);
        }),
        map((response) => response.items),
      ),
  });

  public adventureTemplates = computed(() => this.resource.value() as HwAdventureTemplate[]);

  public loading = computed(() => this.resource.isLoading());

  public info(adventureTemplate: HwAdventureTemplate): void {
    // TODO
    console.log(`Info for ${adventureTemplate.name}`);
  }

  public start(adventureTemplate: HwAdventureTemplate): void {
    const dialog: LazyDialog<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      ConfirmationDialogResult
    > = {
      importFn: () =>
        import('../../../../shared/confirmation-dialog/confirmation-dialog.component').then(
          (m) => m.ConfirmationDialogComponent,
        ),
    };
    void this.dialogService
      .open(dialog, {
        title: 'Start adventure',
        question: `Are you sure you want to start the adventure ${adventureTemplate.name}?`,
      })
      .then((dialogRef) => {
        dialogRef.afterClosed$
          .pipe(
            filter((confirmed) => !!confirmed),
            tap(() => {
              this.campaignService.start(adventureTemplate.id);
            }),
          )
          .subscribe();
      });
  }
}
