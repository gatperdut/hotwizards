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

export type PickupGoldDialogData = {
  amount: number;
};

export type PickupGoldDialogResult = number | undefined;

@Component({
  selector: 'app-pickup-gold-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    InputTextComponent,
    ButtonComponent,
    FormRoot,
  ],
  templateUrl: './pickup-gold-dialog.component.html',
  styleUrl: './pickup-gold-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickupGoldDialogComponent {
  public data = inject<PickupGoldDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<PickupGoldDialogResult>>(DialogRef);

  public model = signal<number>(Math.round(this.data.amount / 2));

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath, { message: 'Enter  amount of gold coins to take' });
      min(schemaPath, 1, { message: 'Take at least 1 gold coin' });
      max(schemaPath, this.data.amount, { message: 'There are not that many gold coins' });
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
