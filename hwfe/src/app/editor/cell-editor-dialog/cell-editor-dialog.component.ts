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
import { GroundSpritePaths } from '../consts/ground-path.const';
import { HwCellPixi } from '../interfaces/cell-pixi.interface';
import { EditorService } from '../services/editor.service';

export type CellEditorDialogData = {
  cell: HwCellPixi;
};

export type CellEditorDialogResult = HwCellPixi | undefined;

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
  private editorService = inject(EditorService);

  public model = signal<CellData>({
    groundSpritePath:
      this.data.cell?.groundSpritePath ||
      GroundSpritePaths[Math.floor(Math.random() * GroundSpritePaths.length)],
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.groundSpritePath, { message: 'A ground sprite path is required' });
    },
    { submission: { action: async () => {} } },
  );

  public groundSpritePaths = GroundSpritePaths.slice();
  public groundSpritePathDisplayFn = (groundSpritePath: string): string =>
    groundSpritePath.split('/').pop() as string;

  public delete(): void {}
}
