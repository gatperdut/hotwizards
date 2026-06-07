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

export type MoveGoldDialogData = {
  taking: boolean;
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

  public model = signal<number>(this.data.taking ? Math.round(this.data.amount / 2) : 100);

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath, {
        message: this.data.taking
          ? 'Enter  amount of gold coins to take'
          : 'Enter amount of gold coins to add',
      });
      min(schemaPath, 1, {
        message: this.data.taking ? 'Take at least 1 gold coin' : 'Add at least 1 gold coin',
      });
      if (this.data.taking) {
        max(schemaPath, this.data.amount, { message: 'There are not that many gold coins' });
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
