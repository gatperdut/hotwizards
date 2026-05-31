import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { form, FormRoot, required, validate, ValidationError } from '@angular/forms/signals';
import { Direction, Directions } from '@hw/shared/directions';
import { MonsterType, MonsterTypes } from '@hw/shared/dungeon';
import {
  BaseSpritePath,
  BaseSpritePaths,
  ClosedDoorSpritePaths,
  DoorSpritePath,
  FeatureSpritePath,
  FeatureSpritePaths,
  FeatureSpriteSecondaries,
  FloorSpritePath,
  FloorSpritePaths,
  FloorTrapSpritePath,
  FloorTrapSpritePaths,
  monsterSpritePath,
  MonsterSpritePath,
  OpenChestSpritePath,
  OpenChestSpritePaths,
  StairsSpritePath,
  StairsSpritePaths,
  WaterSpritePaths,
} from '@hw/shared/sprites';
import { FeatureSpriteTrappable } from '../../sprites/feature-sprites.const';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { spritePathDisplayFn } from '../consts/sprite-path-display-fn.const';
import { HwfeEditorCell } from '../interfaces/editor-cell.interface';
import { EditorService } from '../services/editor.service';

type CellTransformEditable = {
  baseSpritePath: BaseSpritePath;
  featureSpritePath: FeatureSpritePath | null;
  featureTrapped: boolean;
  doorSpritePath: DoorSpritePath | null;
  monsterType: MonsterType | null;
  monsterDirection: Direction;
  floorTrapSpritePath: FloorTrapSpritePath | null;
  stairsSpritePath: StairsSpritePath | null;
  cornerN: boolean;
  cornerE: boolean;
  cornerS: boolean;
  cornerW: boolean;
  spawn: boolean;
};

export type CellTransform = CellTransformEditable &
  CellTransformDerivedData &
  CellTransformExternalData;

export type CellTransformDerivedData = {
  monsterSpritePath: MonsterSpritePath | null;
};

export type CellTransformExternalData = {
  madeSecondary: Pick<HwfeEditorCell, 'x' | 'y'>[];
  unmadeSecondary: Pick<HwfeEditorCell, 'x' | 'y'>[];
};

export type CellEditorDialogData = {
  cell: HwfeEditorCell;
};

export type CellEditorDialogResult = CellTransform | undefined | null;

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
      this.form.featureTrapped().value();
      this.form.doorSpritePath().value();
      this.form.monsterType().value();
      this.form.monsterDirection().value();
      this.form.floorTrapSpritePath().value();
      this.form.stairsSpritePath().value();
      this.form.cornerN().value();
      this.form.cornerE().value();
      this.form.cornerS().value();
      this.form.cornerW().value();
      this.form.spawn().value();

      this.form.baseSpritePath().markAsTouched();
      this.form.featureSpritePath().markAsTouched();
      this.form.featureTrapped().markAsTouched();
      this.form.doorSpritePath().markAsTouched();
      this.form.monsterType().markAsTouched();
      this.form.monsterDirection().markAsTouched();
      this.form.floorTrapSpritePath().markAsTouched();
      this.form.stairsSpritePath().markAsTouched();
      this.form.cornerN().markAsTouched();
      this.form.cornerE().markAsTouched();
      this.form.cornerS().markAsTouched();
      this.form.cornerW().markAsTouched();
      this.form.spawn().markAsTouched();
    });

    effect(() => {
      const featureSpritePath = this.form.featureSpritePath().value();
      const originalFeatureSpritePath = this.data.cell.feature.spritePath;

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
      }
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
    });
  }

  private externalData = signal<CellTransformExternalData>({
    madeSecondary: [],
    unmadeSecondary: [],
  });

  public result = computed<CellTransform>(() => {
    const monsterType = this.model().monsterType;

    return {
      ...this.model(),
      monsterSpritePath: monsterType
        ? monsterSpritePath(monsterType, this.model().monsterDirection)
        : null,
      ...this.externalData(),
    };
  });

  public model = signal<CellTransformEditable>({
    baseSpritePath: this.data.cell.baseSpritePath,
    featureSpritePath: this.data.cell.feature.spritePath as FeatureSpritePath,
    featureTrapped: this.data.cell.feature.trapped,
    doorSpritePath: this.data.cell.doorSpritePath,
    monsterType: this.data.cell.monster.type,
    monsterDirection: this.data.cell.monster.direction,
    floorTrapSpritePath: this.data.cell.floorTrapSpritePath,
    stairsSpritePath: this.data.cell.stairsSpritePath,
    cornerN: this.data.cell.corners.n,
    cornerE: this.data.cell.corners.e,
    cornerS: this.data.cell.corners.s,
    cornerW: this.data.cell.corners.w,
    spawn: this.data.cell.spawn,
  });

  private error(message: string): ValidationError {
    return {
      kind: 'editorError',
      message: message,
    };
  }

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
          return this.error('A secondary cell cannot be water');
        }

        return null;
      });

      validate(schemaPath.featureSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A feature cannot be placed on water');
        }
        if (valueOf(schemaPath.doorSpritePath)) {
          return this.error('A feature cannot be placed together with a door');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A feature cannot be placed together with a monster');
        }
        if (valueOf(schemaPath.floorTrapSpritePath)) {
          return this.error('A feature cannot be placed together with a floor trap');
        }
        if (valueOf(schemaPath.stairsSpritePath)) {
          return this.error('A feature cannot be placed together with a set of stairs');
        }
        if (valueOf(schemaPath.spawn)) {
          return this.error('A feature cannot be placed in a spawn cell');
        }
        if (this.data.cell.secondary) {
          return this.error('A feature cannot be placed in a secondary cell');
        }

        const enoughRoomErrors = FeatureSpriteSecondaries[value() as FeatureSpritePath]
          .map((offset) => {
            const coords = `+(${offset.x}, ${offset.y})`;
            const cell = this.editorService.findCell(
              this.data.cell.x + offset.x,
              this.data.cell.y + offset.y,
            );

            if (!cell) {
              return this.error(`A cell must be present at ${coords}`);
            }
            if (!FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath)) {
              return this.error(`The cell at ${coords} is water`);
            }
            if (cell.feature.spritePath) {
              return this.error(`There is a feature at ${coords}`);
            }
            if (cell.doorSpritePath) {
              return this.error(`There is a door at ${coords}`);
            }
            if (cell.monster.type) {
              return this.error(`There is a monster at ${coords}`);
            }
            if (cell.floorTrapSpritePath) {
              return this.error(`There is a floor trap at ${coords}`);
            }
            if (cell.stairsSpritePath) {
              return this.error(`There is a set of stairs at ${coords}`);
            }
            if (cell.spawn) {
              return this.error(`Cell at ${coords} is a spawn cell`);
            }
            if (
              cell.secondary &&
              cell.secondary.x !== this.data.cell.x &&
              cell.secondary.y !== this.data.cell.y
            ) {
              return this.error(`Cell at ${coords} is secondary`);
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

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A door cannot be placed on water');
        }
        if (valueOf(schemaPath.featureSpritePath)) {
          return this.error('A door cannot be placed together with a feature');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A door cannot be placed together with a monster');
        }
        if (valueOf(schemaPath.floorTrapSpritePath)) {
          return this.error('A door cannot be placed together with a floor trap');
        }
        if (valueOf(schemaPath.stairsSpritePath)) {
          return this.error('A door cannot be placed together with a set of stairs');
        }
        if (valueOf(schemaPath.spawn)) {
          return this.error('A door cannot be placed in a spawn cell');
        }
        if (this.data.cell.secondary) {
          return this.error('A door cannot be placed in a secondary cell');
        }

        return null;
      });

      validate(schemaPath.monsterType, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A monster cannot be placed on water');
        }
        if (valueOf(schemaPath.featureSpritePath)) {
          return this.error('A monster cannot be placed together with a feature');
        }
        if (valueOf(schemaPath.doorSpritePath)) {
          return this.error('A monster cannot be placed together with a door');
        }
        if (valueOf(schemaPath.floorTrapSpritePath)) {
          return this.error('A monster cannot be placed together with a floor trap');
        }
        if (valueOf(schemaPath.stairsSpritePath)) {
          return this.error('A monster cannot be placed together with a set of stairs');
        }
        if (valueOf(schemaPath.spawn)) {
          return this.error('A monster cannot be placed in a spawn cell');
        }
        if (this.data.cell.secondary) {
          return this.error('A monster cannot be placed in a secondary cell');
        }

        return null;
      });

      validate(schemaPath.floorTrapSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A floor trap cannot be placed on water');
        }
        if (valueOf(schemaPath.featureSpritePath)) {
          return this.error('A floor trap cannot be placed together with a feature');
        }
        if (valueOf(schemaPath.doorSpritePath)) {
          return this.error('A floor trap cannot be placed together with a door');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A floor trap cannot be placed together with a monster');
        }
        if (valueOf(schemaPath.stairsSpritePath)) {
          return this.error('A floor trap cannot be placed together with a set of stairs');
        }
        if (valueOf(schemaPath.spawn)) {
          return this.error('A floor trap cannot be placed in a spawn cell');
        }
        if (this.data.cell.secondary) {
          return this.error('A floor trap cannot be placed in a secondary cell');
        }

        return null;
      });

      validate(schemaPath.stairsSpritePath, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A set of stairs cannot be placed on water');
        }
        if (valueOf(schemaPath.featureSpritePath)) {
          return this.error('A set of stairs cannot be placed together with a feature');
        }
        if (valueOf(schemaPath.doorSpritePath)) {
          return this.error('A set of stairs cannot be placed together with a door');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A set of stairs cannot be placed together with a monster');
        }
        if (valueOf(schemaPath.floorTrapSpritePath)) {
          return this.error('A set of stairs cannot be placed together with a floor trap');
        }
        if (valueOf(schemaPath.spawn)) {
          return this.error('A set of stairs cannot be placed in a spawn cell');
        }
        if (this.data.cell.secondary) {
          return this.error('A set of stairs cannot be placed in a secondary cell');
        }

        return null;
      });

      validate(schemaPath.spawn, ({ value, valueOf }) => {
        if (!value()) {
          return null;
        }

        if (!FloorSpritePaths.includes(valueOf(schemaPath.baseSpritePath) as FloorSpritePath)) {
          return this.error('A spawn cell cannot be on water');
        }

        if (valueOf(schemaPath.featureSpritePath)) {
          return this.error('A spawn cell cannot contain a feature');
        }
        if (valueOf(schemaPath.doorSpritePath)) {
          return this.error('A spawn cell cannot contain a door');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A spawn cell cannot contain a monster');
        }
        if (valueOf(schemaPath.monsterType)) {
          return this.error('A spawn cell cannot contain a floor trap');
        }
        if (valueOf(schemaPath.stairsSpritePath)) {
          return this.error('A spawn cell cannot contain a set of stairs');
        }
        if (this.data.cell.secondary) {
          return this.error('A spawn cell cannot be secondary');
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
  public featureSpritePaths = FeatureSpritePaths.slice().filter(
    (path) => !OpenChestSpritePaths.includes(path as OpenChestSpritePath),
  );
  public featureSpriteTrappable = FeatureSpriteTrappable;
  public doorSpritePaths = ClosedDoorSpritePaths.slice();
  public monsterTypes = MonsterTypes.slice();
  public floorTrapSpritePaths = FloorTrapSpritePaths.slice();
  public stairsSpritePaths = StairsSpritePaths.slice();
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

  public randomFloorTrap(): void {
    this.form
      .floorTrapSpritePath()
      .value.set(FloorTrapSpritePaths[Math.floor(Math.random() * FloorTrapSpritePaths.length)]);
    this.form.floorTrapSpritePath().markAsDirty();
  }
}
