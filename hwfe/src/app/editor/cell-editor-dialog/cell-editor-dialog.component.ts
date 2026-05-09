import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { BaseSpritePath, BaseSpritePaths } from '../types/base-sprite-paths.const';
import { FeatureSpritePath, FeatureSpritePaths } from '../types/feature-sprite-paths.const';
import { FloorSpritePath, FloorSpritePaths } from '../types/floor-sprite-paths.const';

type CellTransformEditableData = {
  baseSpritePath: BaseSpritePath;
  featureSpritePath: FeatureSpritePath | null;
};

export type CellTransformData = CellTransformEditableData & {
  traversable: boolean;
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
    JsonPipe,
  ],
  templateUrl: './cell-editor-dialog.component.html',
  styleUrl: './cell-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditorDialogComponent {
  public data = inject<CellEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CellEditorDialogResult>>(DialogRef);

  public result = computed<CellTransformData>(() => ({
    ...this.model(),
    traversable:
      FloorSpritePaths.includes(this.model().baseSpritePath as FloorSpritePath) &&
      !this.model().featureSpritePath,
  }));

  public model = signal<CellTransformEditableData>({
    baseSpritePath: this.data.cell.baseSpritePath as BaseSpritePath,
    featureSpritePath: this.data.cell.featureSpritePath as FeatureSpritePath,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.baseSpritePath, { message: 'A base sprite path is required' });
    },
    {
      submission: {
        action: async () => {
          this.dialogRef.close(this.result());
        },
      },
    },
  );

  public baseSpritePaths = BaseSpritePaths.slice();
  public featureSpritePaths = FeatureSpritePaths.slice();

  public spritePathDisplayFn = (baseSpritePath: string): string =>
    baseSpritePath?.split('/').pop()?.split('.')[0] as string;
}
