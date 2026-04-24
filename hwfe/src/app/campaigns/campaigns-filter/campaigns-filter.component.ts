import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { HwCampaignSearchDto } from '@hw/shared';
import { InputTextComponent } from '../../ui/input-text/input-text.component';

@Component({
  selector: 'app-campaigns-filter',
  imports: [InputTextComponent],
  templateUrl: './campaigns-filter.component.html',
  styleUrl: './campaigns-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsFilterComponent {
  public form = input.required<FieldTree<HwCampaignSearchDto>>();

  public loading = input.required<boolean>();

  public termField = computed(() => this.form().term as FieldTree<string>);
}
