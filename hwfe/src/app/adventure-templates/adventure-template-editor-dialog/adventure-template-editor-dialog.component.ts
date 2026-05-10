import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, maxLength, required } from '@angular/forms/signals';
import { HwCampaignEditDto } from '@hw/shared';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { AdventureTemplatesApiService } from '../services/adventure-templates-api.service';

export type AdventureTemplateDialogData = {
  adventureTemplateId?: number;
  dto: HwCampaignEditDto;
};

export type AdventureTemplateDialogResult = boolean;

@Component({
  selector: 'app-adventure-template-editor-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    InputTextComponent,
    FormRoot,
  ],
  templateUrl: './adventure-template-editor-dialog.component.html',
  styleUrl: './adventure-template-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventureTemplateDialogComponent {
  public data = inject<AdventureTemplateDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<AdventureTemplateDialogResult>>(DialogRef);
  private adventureTemplatesApiService = inject(AdventureTemplatesApiService);

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
        action: async () => {},
      },
    },
  );
}
