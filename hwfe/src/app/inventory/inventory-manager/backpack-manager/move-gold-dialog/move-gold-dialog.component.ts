import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, max, min, required } from '@angular/forms/signals';
import { InputTextComponent } from '@hw/hwfe/app/ui/input-text/input-text.component';
import { ButtonComponent } from '../../../../ui/button/button.component';
import { DialogRef } from '../../../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../../../ui/dialog/services/dialog.service';

export const MoveGoldTypes = ['pickup', 'drop', 'give'] as const;

export type MoveGoldType = (typeof MoveGoldTypes)[number];

export type MoveGoldDialogData = {
  type: MoveGoldType;
  amount: number;
};

export type MoveGoldDialogResult = number | undefined;

@Component({
  selector: 'app-move-gold-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    InputTextComponent,
    ButtonComponent,
    FormRoot,
  ],
  templateUrl: './move-gold-dialog.component.html',
  styleUrl: './move-gold-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveGoldDialogComponent {
  public data = inject<MoveGoldDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<MoveGoldDialogResult>>(DialogRef);

  public model = signal<number>(this.data.type === 'drop' ? 100 : Math.round(this.data.amount / 2));

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath, {
        message:
          this.data.type === 'drop'
            ? 'Enter amount of gold coins to add'
            : this.data.type === 'give'
              ? 'Enter amount of gold to give'
              : 'Enter  amount of gold coins to take',
      });
      min(schemaPath, 1, {
        message:
          this.data.type === 'drop'
            ? 'Add at least 1 gold coin'
            : this.data.type === 'give'
              ? 'Give at least 1 gold coin'
              : 'Take at least 1 gold coin',
      });
      if (this.data.type === 'pickup') {
        max(schemaPath, this.data.amount, { message: 'There are not that many gold coins' });
      }
      if (this.data.type === 'give') {
        max(schemaPath, this.data.amount, { message: 'You do not have that many gold coins' });
      }
    },
    {
      submission: {
        action: async () => {
          this.dialogRef.close(this.model());
        },
      },
    },
  );
}
