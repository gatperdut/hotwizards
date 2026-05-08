import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HwCell } from '@hw/shared';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CellEditorDialogData = {
  cell: HwCell;
};

export type CellEditorDialogResult = HwCell;

@Component({
  selector: 'app-cell-editor-dialog',
  imports: [DialogComponent, DialogTitleDirective, DialogContentDirective, DialogActionsDirective],
  templateUrl: './cell-editor-dialog.component.html',
  styleUrl: './cell-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorDialogComponent {
  public data = inject<CellEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CellEditorDialogResult>>(DialogRef);
}
