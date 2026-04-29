import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, maxLength, required } from '@angular/forms/signals';
import { Movement } from '@hw/prismagen/enums';
import { HwCampaignEditDto } from '@hw/shared';
import { firstValueFrom } from 'rxjs';
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

export type CampaignEditorDialogData = {
  campaignId?: number;
  dto: HwCampaignEditDto;
};

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
    FormRoot,
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

  public movements = Object.values(Movement);
  public movementDisplayFn = (movement: Movement): string => this.movementsService.name(movement);

  public model = signal({
    name: this.data.dto.name,
    aoo: this.data.dto.aoo,
    movement: this.data.dto.movement,
  });
  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.name, { message: 'The name is required' });
      maxLength(schemaPath.name, 40, { message: '40 characters or less' });
    },
    {
      submission: {
        action: async () => {
          const result = await firstValueFrom(
            this.data.campaignId
              ? this.campaignsApiService.update(this.data.campaignId, this.model())
              : this.campaignsApiService.create(this.model()),
          );

          if (typeof result === 'number') {
            this.dialogRef.close(true);
            return;
          }

          return {
            kind: 'serverError',
            message: this.data.campaignId
              ? 'Campaign could not be updated'
              : 'Campaign could not be created',
          };
        },
      },
    },
  );
}
