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
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
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
import {
  MonsterSpritePath,
  MonsterSpritePaths,
} from '../consts/sprite-paths/monster-sprite-paths.const';
import { WaterSpritePaths } from '../consts/sprite-paths/water-sprite-paths.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';

type CellTransformEditableData = {
  baseSpritePath: BaseSpritePath;
  featureSpritePath: FeatureSpritePath | null;
  doorSpritePath: DoorSpritePath | null;
  monsterSpritePath: MonsterSpritePath | null;
  spawn: boolean;
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
    CheckboxComponent,
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
      this.form.monsterSpritePath().value();
      this.form.spawn().value();
      this.form.baseSpritePath().markAsTouched();
      this.form.featureSpritePath().markAsTouched();
      this.form.doorSpritePath().markAsTouched();
      this.form.monsterSpritePath().markAsTouched();
      this.form.spawn().markAsTouched();
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
    monsterSpritePath: this.data.cell.monsterSpritePath as MonsterSpritePath,
    spawn: this.data.cell.spawn,
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
            message: 'A feature cannot be placed on water',
          };
        }
        const doorSpritePath = valueOf(schemaPath.doorSpritePath);
        if (doorSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A feature cannot be placed together with a door',
          };
        }
        const monsterSpritePath = valueOf(schemaPath.monsterSpritePath);
        if (monsterSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A feature cannot be placed together with a creature',
          };
        }
        const spawn = valueOf(schemaPath.spawn);
        if (spawn) {
          return {
            kind: 'locationCrowded',
            message: 'A feature cannot be placed in a spawn cell',
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
            message: 'A door cannot be placed on water',
          };
        }
        const featureSpritePath = valueOf(schemaPath.featureSpritePath);
        if (featureSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A door cannot be placed together with a feature',
          };
        }
        const monsterSpritePath = valueOf(schemaPath.monsterSpritePath);
        if (monsterSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A door cannot be placed together with a creature',
          };
        }
        const spawn = valueOf(schemaPath.spawn);
        if (spawn) {
          return {
            kind: 'locationCrowded',
            message: 'A door cannot be placed in a spawn cell',
          };
        }

        return null;
      });

      validate(schemaPath.monsterSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        const baseSpritePath = valueOf(schemaPath.baseSpritePath);
        if (!FloorSpritePaths.includes(baseSpritePath as FloorSpritePath)) {
          return {
            kind: 'locationCrowded',
            message: 'A creature cannot be placed on water',
          };
        }
        const featureSpritePath = valueOf(schemaPath.featureSpritePath);
        if (featureSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A creature cannot be placed together with a feature',
          };
        }
        const doorSpritePath = valueOf(schemaPath.doorSpritePath);
        if (doorSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A creature cannot be placed together with a door',
          };
        }
        const spawn = valueOf(schemaPath.spawn);
        if (spawn) {
          return {
            kind: 'locationCrowded',
            message: 'A creature cannot be placed in a spawn cell',
          };
        }

        return null;
      });

      validate(schemaPath.spawn, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        const baseSpritePath = valueOf(schemaPath.baseSpritePath);
        if (!FloorSpritePaths.includes(baseSpritePath as FloorSpritePath)) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot be on water',
          };
        }

        const featureSpritePath = valueOf(schemaPath.featureSpritePath);
        if (featureSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot contain a feature',
          };
        }
        const doorSpritePath = valueOf(schemaPath.doorSpritePath);
        if (doorSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot contain a door',
          };
        }
        const monsterSpritePath = valueOf(schemaPath.monsterSpritePath);
        if (monsterSpritePath) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot contain a creature',
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
  public monsterSpritePaths = MonsterSpritePaths.slice();

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
