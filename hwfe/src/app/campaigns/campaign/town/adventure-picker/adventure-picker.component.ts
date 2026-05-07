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
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { PaginatorComponent } from '@hw/hwfe/app/ui/paginator/paginator.component';
import { HwAdventureTemplate, HwAdventureTemplateSearchDto } from '@hw/shared';
import { map, tap } from 'rxjs';
import { AdventurePickerFilterComponent } from './adventure-picker-filter/adventure-picker-filter.component';

export type AdventurePickerAction = {
  label: string;
  action: (adventureTemplate: HwAdventureTemplate) => void;
  color?: 'primary' | 'secondary' | 'warning';
  disabled?: () => boolean;
};

@Component({
  selector: 'app-adventure-picker',
  imports: [PaginatorComponent, AdventurePickerFilterComponent, ButtonComponent],
  templateUrl: './adventure-picker.component.html',
  styleUrl: './adventure-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventurePickerComponent {
  private adventureTemplatesApiService = inject(AdventureTemplatesApiService);

  public actions = input<AdventurePickerAction[]>([]);

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

  public adventureTemplates = computed(() => this.resource.value() || []);

  public loading = computed(() => this.resource.isLoading());

  public info(adventureTemplate: HwAdventureTemplate): void {
    // TODO
    console.log(`Info for ${adventureTemplate.name}`);
  }
}
