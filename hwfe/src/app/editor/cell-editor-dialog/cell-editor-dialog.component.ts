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
import { cellIsTraversable } from '../consts/cell-is-traversable.const';
import { spritePathDisplayFn } from '../consts/sprite-path-display-fn.const';
import { BaseSpritePath, BaseSpritePaths } from '../consts/sprite-paths/base-sprite-paths.const';
import { DoorSpritePath, DoorSpritePaths } from '../consts/sprite-paths/door-sprite-paths.const';
import {
  FeatureSpritePath,
  FeatureSpritePaths,
} from '../consts/sprite-paths/feature-sprite-paths.const';
import { FloorSpritePath, FloorSpritePaths } from '../consts/sprite-paths/floor-sprite-paths.const';
import { WaterSpritePaths } from '../consts/sprite-paths/water-sprite-paths.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';

type CellTransformEditableData = {
  baseSpritePath: BaseSpritePath;
  featureSpritePath: FeatureSpritePath | null;
  doorSpritePath: DoorSpritePath | null;
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
      this.form.featureSpritePath().value();
      this.form.doorSpritePath().value();
      this.form.baseSpritePath().markAsTouched();
      this.form.featureSpritePath().markAsTouched();
      this.form.doorSpritePath().markAsTouched();
    });
  }

  public result = computed<CellTransformData>(() => ({
    ...this.model(),
    traversable: cellIsTraversable(this.model()),
  }));

  public model = signal<CellTransformEditableData>({
    baseSpritePath: this.data.cell.baseSpritePath as BaseSpritePath,
    featureSpritePath: this.data.cell.featureSpritePath as FeatureSpritePath,
    doorSpritePath: this.data.cell.doorSpritePath as DoorSpritePath,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.baseSpritePath, { message: 'A base sprite path is required' });
      validate(schemaPath.featureSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        const baseSpritePath = valueOf(schemaPath.baseSpritePath);
        if (!FloorSpritePaths.includes(baseSpritePath as FloorSpritePath)) {
          return {
            kind: 'locationCrowded',
            message: 'Features must be on a floor',
          };
        }

        const doorSpritePath = valueOf(schemaPath.doorSpritePath);
        if (doorSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'There cannot be a feature where a door is',
          };
        }

        return null;
      });

      validate(schemaPath.doorSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        const baseSpritePath = valueOf(schemaPath.baseSpritePath);
        if (!FloorSpritePaths.includes(baseSpritePath as FloorSpritePath)) {
          return {
            kind: 'locationCrowded',
            message: 'Doors must be on a floor',
          };
        }

        const featureSpritePath = valueOf(schemaPath.featureSpritePath);
        if (featureSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'There cannot be a door where a feature is',
          };
        }

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
  public doorSpritePaths = DoorSpritePaths.slice();

  public spritePathDisplayFn = spritePathDisplayFn;

  public randomFloor(): void {
    this.form
      .baseSpritePath()
      .value.set(FloorSpritePaths[Math.floor(Math.random() * FloorSpritePaths.length)]);
    this.form.baseSpritePath().markAsDirty();
  }

  public randomWater(): void {
    this.form
      .baseSpritePath()
      .value.set(WaterSpritePaths[Math.floor(Math.random() * WaterSpritePaths.length)]);
    this.form.baseSpritePath().markAsDirty();
  }
}
