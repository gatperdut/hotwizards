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
import { Direction } from '@hw/shared';
import { Directions } from '../../../../../shared/dist/shared/src/direction/direction.const';
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
  FeatureSpriteSecondaries,
} from '../consts/sprite-paths/feature-sprite-paths.const';
import { FloorSpritePath, FloorSpritePaths } from '../consts/sprite-paths/floor-sprite-paths.const';
import {
  monsterSpritepath,
  MonsterSpritePath,
  MonsterType,
  MonsterTypes,
} from '../consts/sprite-paths/monster-sprite-paths.const';
import { WaterSpritePaths } from '../consts/sprite-paths/water-sprite-paths.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { EditorService } from '../services/editor.service';

type CellTransformEditableData = {
  baseSpritePath: BaseSpritePath;
  featureSpritePath: FeatureSpritePath | null;
  doorSpritePath: DoorSpritePath | null;
  monsterType: MonsterType | null;
  monsterDirection: Direction;
  spawn: boolean;
};

export type CellTransformData = CellTransformEditableData &
  CellTransformDerivedData &
  CellTransformExternalData;

export type CellTransformDerivedData = {
  traversable: boolean;
  monsterSpritePath: MonsterSpritePath | null;
};

export type CellTransformExternalData = {
  madeSecondary: Pick<HwPixiCell, 'x' | 'y'>[];
  unmadeSecondary: Pick<HwPixiCell, 'x' | 'y'>[];
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
  private editorService = inject(EditorService);

  constructor() {
    effect(() => {
      this.form.baseSpritePath().value();
      this.form.featureSpritePath().value();
      this.form.doorSpritePath().value();
      this.form.monsterType().value();
      this.form.monsterDirection().value();
      this.form.spawn().value();
      this.form.baseSpritePath().markAsTouched();
      this.form.featureSpritePath().markAsTouched();
      this.form.doorSpritePath().markAsTouched();
      this.form.monsterType().markAsTouched();
      this.form.monsterDirection().markAsTouched();
      this.form.spawn().markAsTouched();
    });

    effect(() => {
      const featureSpritePath = this.form.featureSpritePath().value();
      const originalFeatureSpritePath = this.data.cell.featureSpritePath;

      this.externalData.update((value) => ({
        ...value,
        madeSecondary: [],
      }));

      if (originalFeatureSpritePath) {
        this.externalData.update((value) => ({
          ...value,
          unmadeSecondary: FeatureSpriteSecondaries[originalFeatureSpritePath as FeatureSpritePath]
            .map((offset) => {
              const cell = this.editorService.findCell(
                this.data.cell.x + offset.x,
                this.data.cell.y + offset.y,
              );
              if (!cell) {
                return null;
              }
              return { x: cell.x, y: cell.y };
            })
            .filter((affectedCell) => !!affectedCell),
        }));
        if (featureSpritePath) {
          this.externalData.update((value) => ({
            ...value,
            madeSecondary: FeatureSpriteSecondaries[featureSpritePath as FeatureSpritePath]
              .map((offset) => {
                const cell = this.editorService.findCell(
                  this.data.cell.x + offset.x,
                  this.data.cell.y + offset.y,
                );
                if (!cell) {
                  return null;
                }
                return { x: cell.x, y: cell.y };
              })
              .filter((affectedCell) => !!affectedCell),
          }));
        }
      } else {
        if (featureSpritePath) {
          this.externalData.update((value) => ({
            ...value,
            madeSecondary: FeatureSpriteSecondaries[featureSpritePath as FeatureSpritePath]
              .map((offset) => {
                const cell = this.editorService.findCell(
                  this.data.cell.x + offset.x,
                  this.data.cell.y + offset.y,
                );
                if (!cell) {
                  return null;
                }
                return { x: cell.x, y: cell.y };
              })
              .filter((affectedCell) => !!affectedCell),
          }));
        }
      }
    });
  }

  private externalData = signal<CellTransformExternalData>({
    madeSecondary: [],
    unmadeSecondary: [],
  });

  public result = computed<CellTransformData>(() => ({
    ...this.model(),
    traversable: cellIsTraversable({ ...this.model(), secondary: this.data.cell.traversable }),
    monsterSpritePath: monsterSpritepath(this.model().monsterType, this.model().monsterDirection),
    ...this.externalData(),
  }));

  public model = signal<CellTransformEditableData>({
    baseSpritePath: this.data.cell.baseSpritePath as BaseSpritePath,
    featureSpritePath: this.data.cell.featureSpritePath as FeatureSpritePath,
    doorSpritePath: this.data.cell.doorSpritePath as DoorSpritePath,
    monsterType: this.data.cell.monster.type as MonsterType,
    monsterDirection: this.data.cell.monster.direction,
    spawn: this.data.cell.spawn,
  });

  public form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.baseSpritePath, { message: 'A base sprite path is required' });
      validate(schemaPath.baseSpritePath, ({ value, valueOf: _valueOf }) => {
        if (!value) {
          return null;
        }

        const secondary = this.data.cell.secondary;
        if (secondary && !FloorSpritePaths.includes(value() as FloorSpritePath)) {
          return {
            kind: 'locationCrowded',
            message: 'A secondary cell cannot be water',
          };
        }

        return null;
      });

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
        const monsterType = valueOf(schemaPath.monsterType);
        if (monsterType) {
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
        const secondary = this.data.cell.secondary;
        if (secondary) {
          return {
            kind: 'locationCrowded',
            message: 'A feature cannot be placed in a secondary cell',
          };
        }

        const enoughRoomErrors = FeatureSpriteSecondaries[value() as FeatureSpritePath]
          .map((offset) => {
            const coords = `+(${offset.x}, ${offset.y})`;
            const cell = this.editorService.findCell(
              this.data.cell.x + offset.x,
              this.data.cell.y + offset.y,
            );

            if (!cell) {
              return {
                kind: 'locationCrowded',
                message: `A cell must be present at ${coords}.`,
              };
            }
            if (!FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath)) {
              return {
                kind: 'locationCrowded',
                message: `The cell at ${coords} is water.`,
              };
            }
            if (cell.featureSpritePath) {
              return {
                kind: 'locationCrowded',
                message: `There is a feature at ${coords}.`,
              };
            }
            if (cell.doorSpritePath) {
              return {
                kind: 'locationCrowded',
                message: `There is a door at ${coords}.`,
              };
            }
            if (cell.monster.type) {
              return {
                kind: 'locationCrowded',
                message: `There is a monster at ${coords}.`,
              };
            }
            if (cell.spawn) {
              return {
                kind: 'locationCrowded',
                message: `Cell at ${coords} is a spawn cell.`,
              };
            }
            if (cell.secondary) {
              return {
                kind: 'locationCrowded',
                message: `Cell at ${coords} is secondary.`,
              };
            }

            return null;
          })
          .filter((error) => !!error);
        if (enoughRoomErrors.length) {
          return enoughRoomErrors[0];
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
        const monsterType = valueOf(schemaPath.monsterType);
        if (monsterType) {
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
        const secondary = this.data.cell.secondary;
        if (secondary) {
          return {
            kind: 'locationCrowded',
            message: 'A door cannot be placed in a secondary cell',
          };
        }

        return null;
      });

      validate(schemaPath.monsterType, ({ value, valueOf }) => {
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
        const secondary = this.data.cell.secondary;
        if (secondary) {
          return {
            kind: 'locationCrowded',
            message: 'A creature cannot be placed in a secondary cell',
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
        const monsterType = valueOf(schemaPath.monsterType);
        if (monsterType) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot contain a creature',
          };
        }
        const secondary = this.data.cell.secondary;
        if (secondary) {
          return {
            kind: 'locationCrowded',
            message: 'A spawn cell cannot be secondary',
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
  public monsterTypes = MonsterTypes.slice();
  public directions = Directions.slice();

  public spritePathDisplayFn = spritePathDisplayFn;
  public monsterTypeDisplayFn = (monsterType: MonsterType): string => monsterType;
  public directionDisplayFn = (direction: Direction): string => direction;

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
