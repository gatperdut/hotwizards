import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { form, FormRoot, required, validate } from '@angular/forms/signals';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { BaseSpritePath, BaseSpritePaths } from '../consts/base-sprite-paths.const';
import { cellIsTraversable } from '../consts/cell-is-traversable.const';
import { FeatureSpritePath, FeatureSpritePaths } from '../consts/feature-sprite-paths.const';
import { FloorSpritePath, FloorSpritePaths } from '../consts/floor-sprite-paths.const';
import { spritePathDisplayFn } from '../consts/sprite-path-display-fn.const';
import { WaterSpritePaths } from '../consts/water-sprite-paths.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';

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

  constructor() {
    effect(() => {
      this.form.baseSpritePath().value();
      this.form.featureSpritePath().markAsTouched();
    });
  }

  public result = computed<CellTransformData>(() => ({
    ...this.model(),
    traversable: cellIsTraversable(this.model()),
  }));

  public model = signal<CellTransformEditableData>({
    baseSpritePath: this.data.cell.baseSpritePath as BaseSpritePath,
    featureSpritePath: this.data.cell.featureSpritePath as FeatureSpritePath,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.baseSpritePath, { message: 'A base sprite path is required' });
      validate(schemaPath.featureSpritePath, ({ value, valueOf }) => {
        if (!value) {
          return null;
        }

        const baseSpritePath = valueOf(schemaPath.baseSpritePath);
        if (FloorSpritePaths.includes(baseSpritePath as FloorSpritePath)) {
          return null;
        }

        return {
          kind: 'incompatible',
          message: 'Features must be on a floor.',
        };
        return null;
      });
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

  public spritePathDisplayFn = spritePathDisplayFn;

  public randomFloor(): void {
    this.form
      .baseSpritePath()
      .value.set(FloorSpritePaths[Math.floor(Math.random() * FloorSpritePaths.length)]);
  }

  public randomWater(): void {
    this.form
      .baseSpritePath()
      .value.set(WaterSpritePaths[Math.floor(Math.random() * WaterSpritePaths.length)]);
  }
}
