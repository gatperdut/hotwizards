import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HwItem } from '@hw/shared/inventory';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type ItemDialogAction = {
  label: string;
  callback: () => void;
  color?: 'primary' | 'secondary' | 'warning';
  disabled?: boolean;
};

export type ItemDialogData = {
  item: HwItem;
  actions: ItemDialogAction[];
};

export type ItemDialogResult = void;

@Component({
  selector: 'app-item-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
  ],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDialogComponent {
  public data = inject<ItemDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<ItemDialogResult>>(DialogRef);
}
