import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, maxLength, required } from '@angular/forms/signals';
import { Movement } from '@hw/prismagen/enums';
import { HwCampaignCreateDto, HwCampaignUpdateDto } from '@hw/shared';
import { MovementsService } from '../../rulesets/services/movements.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { SelectComponent } from '../../ui/select/select.component';
import { CampaignsApiService } from '../services/campaigns-api.service';

export type CampaignEditorDialogData = HwCampaignCreateDto | HwCampaignUpdateDto;

export type CampaignEditorDialogResult = boolean;

@Component({
  selector: 'app-campaign-editor-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    CheckboxComponent,
    SelectComponent,
    InputTextComponent,
  ],
  templateUrl: './campaign-editor-dialog.component.html',
  styleUrl: './campaign-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignEditorDialogComponent {
  public data = inject<CampaignEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignEditorDialogResult>>(DialogRef);
  private movementsService = inject(MovementsService);
  private campaignsApiService = inject(CampaignsApiService);

  public creating = !('id' in this.data);

  public movements = Object.values(Movement);
  public movementDisplayFn = (movement: Movement): string => this.movementsService.name(movement);

  public model = signal({
    campaignId: 'id' in this.data ? this.data.id : undefined,
    name: this.data.name,
    aoo: this.data.aoo,
    movement: this.data.movement,
  });
  public form = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'The name is required' });
    maxLength(schemaPath.name, 40, { message: '40 characters or less' });
  });

  public save(): void {
    (this.creating
      ? this.campaignsApiService.create(this.model())
      : this.campaignsApiService.update(this.model() as HwCampaignUpdateDto)
    ).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
