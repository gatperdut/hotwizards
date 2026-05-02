import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { InputTextComponent } from '@hw/hwfe/app/ui/input-text/input-text.component';
import { HwAdventureTemplateSearchDto } from '@hw/shared';

@Component({
  selector: 'app-adventure-picker-filter',
  imports: [InputTextComponent],
  templateUrl: './adventure-picker-filter.component.html',
  styleUrl: './adventure-picker-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventurePickerFilterComponent {
  public form = input.required<FieldTree<HwAdventureTemplateSearchDto>>();

  public loading = input.required<boolean>();

  public termField = computed(() => this.form().term as FieldTree<string>);
}
