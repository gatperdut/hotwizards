import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { InputTextComponent } from '@hw/hwfe/app/ui/input-text/input-text.component';
import { HwCampaignSearchDto } from '@hw/shared';

@Component({
  selector: 'app-campaigns-list-filter',
  imports: [InputTextComponent],
  templateUrl: './campaigns-list-filter.component.html',
  styleUrl: './campaigns-list-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsListFilterComponent {
  public form = input.required<FieldTree<HwCampaignSearchDto>>();

  public loading = input.required<boolean>();

  public termField = computed(() => this.form().term as FieldTree<string>);
}
