import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { GroundSpritePath, GroundSpritePaths } from '../types/ground-sprite-paths.const';

export type CellTransformData = {
  groundSpritePath: GroundSpritePath;
};

export type CellEditorDialogData = {
  cell: HwPixiCell;
};

export type CellEditorDialogResult = CellTransformData | undefined | null;

@Component({
  selector: 'app-cell-editor-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    FormRoot,
    SelectComponent,
    ButtonComponent,
  ],
  templateUrl: './cell-editor-dialog.component.html',
  styleUrl: './cell-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorDialogComponent {
  public data = inject<CellEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CellEditorDialogResult>>(DialogRef);

  public model = signal<CellTransformData>({
    groundSpritePath: this.data.cell.groundSpritePath as GroundSpritePath,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.groundSpritePath, { message: 'A ground sprite path is required' });
    },
    {
      submission: {
        action: async () => {
          this.dialogRef.close(this.model());
        },
      },
    },
  );

  public groundSpritePaths = GroundSpritePaths.slice();
  public groundSpritePathDisplayFn = (groundSpritePath: string): string =>
    groundSpritePath.split('/').pop() as string;
}
