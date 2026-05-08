import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { GroundPaths } from '../consts/ground-path.const';
import { HwCellPixi } from '../interfaces/cell-pixi.interface';

export type CellEditorDialogData = {
  cell: HwCellPixi;
};

export type CellEditorDialogResult = HwCellPixi;

type CellData = {
  groundSpritePath: string;
};

@Component({
  selector: 'app-cell-editor-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    SelectComponent,
  ],
  templateUrl: './cell-editor-dialog.component.html',
  styleUrl: './cell-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorDialogComponent {
  public data = inject<CellEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CellEditorDialogResult>>(DialogRef);

  public model = signal<CellData>({
    groundSpritePath:
      this.data.cell?.groundSpritePath ||
      GroundPaths[Math.floor(Math.random() * GroundPaths.length)],
  });

  public form = form(this.model);
}
