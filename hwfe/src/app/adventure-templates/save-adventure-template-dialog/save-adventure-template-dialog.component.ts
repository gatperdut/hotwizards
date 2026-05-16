import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, maxLength, required } from '@angular/forms/signals';
import { HwAdventureTemplate, HwAdventureTemplateEditDto } from '@hw/shared/adventure-templates';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { AdventureTemplatesApiService } from '../services/adventure-templates-api.service';

export type SaveAdventureTemplateDialogData = {
  adventureTemplateId?: number;
  dto: HwAdventureTemplateEditDto;
};

export type SaveAdventureTemplateDialogResult = HwAdventureTemplate | undefined;

@Component({
  selector: 'app-save-adventure-template-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    InputTextComponent,
    FormRoot,
  ],
  templateUrl: './save-adventure-template-dialog.component.html',
  styleUrl: './save-adventure-template-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveAdventureTemplateDialogComponent {
  public data = inject<SaveAdventureTemplateDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<SaveAdventureTemplateDialogResult>>(DialogRef);
  private adventureTemplatesApiService = inject(AdventureTemplatesApiService);

  public model = signal<HwAdventureTemplateEditDto>({
    name: this.data.dto.name,
    info: this.data.dto.info,
    dungeon: this.data.dto.dungeon,
  });
  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.name, { message: 'The name is required' });
      maxLength(schemaPath.name, 40, { message: '40 characters or less' });

      required(schemaPath.info, { message: 'The information is required' });
    },
    {
      submission: {
        action: async () => {
          const result = await firstValueFrom(
            this.data.adventureTemplateId
              ? this.adventureTemplatesApiService.update(
                  this.data.adventureTemplateId,
                  this.model(),
                )
              : this.adventureTemplatesApiService.create(this.model()),
          );

          if (typeof result === 'number') {
            this.dialogRef.close({ id: result, ...this.model() });
            return;
          }

          return {
            kind: 'serverError',
            message: this.data.adventureTemplateId
              ? 'Campaign could not be updated'
              : 'Campaign could not be created',
          };
        },
      },
    },
  );
}
