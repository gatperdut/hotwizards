import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  cellAt,
  cellIsHint,
  cellsUpdateLos,
  endTurnHero,
  endTurnMaster,
  losFrom,
  moveHero,
  moveMonster,
  openDoor,
  sameCell,
  searchedCells,
  searchSecondaryCells,
  secondaryCells,
} from '@hw/shared/dungeon';
import { HwItemSlots } from '@hw/shared/inventory';
import { forkJoin, tap } from 'rxjs';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { CanvasLoadingComponent } from '../map/canvas-loading/canvas-loading.component';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import {
  BaseSpriteFoggedTint,
  BaseSpritePersonalVisibleTint,
  BaseSpriteSearchedTintSubtraction,
  BaseSpriteSharedVisibleTint,
} from '../sprites/base-sprites.const';
import { FloorTrapSpriteTint } from '../sprites/floor-trap-sprites.const';
import { DungeonSidebarComponent } from './dungeon-sidebar/dungeon-sidebar.component';
import { HwfeCell } from './interfaces/cell.interface';
import { CellService } from './services/cell.service';
import { DungeonService } from './services/dungeon.service';

@Component({
  selector: 'app-dungeon',
  imports: [CanvasLoadingComponent, DungeonSidebarComponent],
  templateUrl: './dungeon.component.html',
  styleUrl: './dungeon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverflowService, DungeonService, CellService, ViewportService, TextureService],
})
export class DungeonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private campaignService = inject(CampaignService);
  private campaignsApiService = inject(CampaignsApiService);
  private toastService = inject(ToastService);
  private cellService = inject(CellService);
  private router = inject(Router);
  private overflowService = inject(OverflowService);
  private dungeonService = inject(DungeonService);
  private viewportService = inject(ViewportService);
  private textureService = inject(TextureService);

  public loading = signal(true);

  constructor() {
    this.dungeonService.campaignsSingleSocket = this.socketService.socket(
      'campaigns-single',
      this.destroyRef,
      { campaignId: this.campaignService.campaign().id },
    );
    this.dungeonService.adventuresSocket = this.socketService.socket(
      'adventures',
      this.destroyRef,
      {
        campaignId: this.campaignService.campaign().id,
      },
    );

    this.campaignsListen();
    this.adventuresListen();

    this.effects();
  }

  public ngAfterViewInit(): void {
    void this.init();
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }

  private init(): void {
    this.overflowService.hide();

    forkJoin([this.textureService.setup(), this.viewportService.setup(this.canvasRef)])
      .pipe(
        tap(() => {
          this.loading.set(false);

          this.dungeonService.setup();

          if (this.campaignService.campaign().master.me) {
            if (this.campaignService.campaign().adventure!.turn > 0) {
              this.centerActiveHero();
            } else {
              this.centerRandomHero();
            }
          } else {
            this.centerMyHero();
          }
        }),
      )
      .subscribe();
  }

  private centerRandomHero(): void {
    const heroes = this.dungeonService.hwfeHeroes();
    const hero = heroes[Math.floor(Math.random() * heroes.length)];
    this.viewportService.center(hero.x, hero.y);
  }

  private centerMyHero(): void {
    const hero = this.dungeonService.myHero();
    this.viewportService.center(hero!.x, hero!.y);
  }

  private centerActiveHero(): void {
    const hero = this.dungeonService.activeHero();
    this.viewportService.center(hero!.x, hero!.y);
  }

  private effects(): void {
    effect((): void => {
      const cells = this.dungeonService.hwfeCells();
      const master = this.campaignService.master();
      const myHero = this.dungeonService.myHero();
      const hwfeMonsters = this.dungeonService.hwfeMonsters();

      cells.forEach((cell) => {
        cell.pixi.baseSprite.visible = master.me;
        cell.pixi.baseSprite.tint = BaseSpritePersonalVisibleTint;
        cell.pixi.baseSprite.alpha = 1.0;
        this.cellService.sprites(cell).forEach((sprite) => {
          sprite.visible = master.me;
          sprite.tint = BaseSpriteSharedVisibleTint;
          sprite.alpha = 1.0;
        });
      });

      cells.forEach((cell) => {
        const sprites = this.cellService.sprites(cell);

        if (cellIsHint(cells, cell)) {
          cell.pixi.baseSprite.visible = true;
          cell.pixi.baseSprite.alpha = master.me ? 1.0 : 0.1;

          if (master.me) {
            cell.pixi.baseSprite.tint = BaseSpriteFoggedTint;
          }
        } else {
          switch (cell.visibility) {
            case 0:
              sprites.forEach((s) => {
                s.visible = master.me;
                if (master.me) {
                  s.tint = BaseSpriteFoggedTint;
                }
              });
              break;

            case 1:
              sprites.forEach((s) => {
                s.visible = true;
                s.tint = BaseSpriteFoggedTint;
              });
              break;

            case 2:
              sprites.forEach((s) => {
                s.visible = true;
                s.tint = master.me ? BaseSpritePersonalVisibleTint : BaseSpriteSharedVisibleTint;
              });
              break;
          }
        }
      });

      cells.forEach((cell) => {
        if (cellIsHint(cells, cell)) {
          return;
        }

        if (!cell.feature.spritePath) {
          return;
        }

        const secCells = secondaryCells(cells, cell);
        if (!secCells.length || secCells.every((c) => c.visibility === 2)) {
          return;
        }
        cell.pixi.featureSprite!.tint = BaseSpriteFoggedTint;
      });

      if (myHero) {
        losFrom<HwfeCell>(cells, [cellAt(cells, myHero.x, myHero.y)!]).forEach((cell) => {
          const sprites = this.cellService.sprites(cell);

          sprites.forEach((s) => {
            s.tint = BaseSpritePersonalVisibleTint;
          });
        });
      }

      cells.forEach((cell) => {
        if (cell.searched) {
          cell.pixi.baseSprite.tint = cell.pixi.baseSprite.tint - BaseSpriteSearchedTintSubtraction;
        }

        if (cell.floorTrap.spritePath) {
          cell.pixi.floorTrapSprite!.visible = cell.floorTrap.found || master.me;
          cell.pixi.floorTrapSprite!.tint = FloorTrapSpriteTint;
          cell.pixi.floorTrapSprite!.alpha = cell.floorTrap.found ? 1.0 : 0.4;
        }

        if (cell.feature.trap.spritePath) {
          cell.pixi.featureTrapSprite!.visible = cell.feature.trap.found || master.me;
          cell.pixi.featureTrapSprite!.tint = FloorTrapSpriteTint;
          cell.pixi.featureTrapSprite!.alpha = cell.feature.trap.found ? 1.0 : 0.4;
        }

        if (cell.door.trap.spritePath) {
          cell.pixi.doorTrapSprite!.visible = cell.door.trap.found || master.me;
          cell.pixi.doorTrapSprite!.tint = FloorTrapSpriteTint;
          cell.pixi.doorTrapSprite!.alpha = cell.door.trap.found ? 1.0 : 0.4;
        }
      });

      hwfeMonsters.forEach((monster) => {
        switch (cellAt(cells, monster.x, monster.y)!.visibility) {
          case 0:
          case 1:
            monster.pixi.sprite.visible = master.me;
            monster.pixi.sprite.alpha = 0.5;
            break;
          case 2:
            monster.pixi.sprite.visible = true;
            monster.pixi.sprite.alpha = 1.0;
            break;
        }
      });
    });
  }

  private campaignsListen(): void {
    this.dungeonService.campaignsSingleSocket.on('downDeleteCampaign', () => {
      this.toastService.show({
        message: `Campaign ${this.campaignService.campaign().name} has been deleted`,
      });

      void this.router.navigate(['home', 'campaigns']);
    });
  }

  private endTurnToast(turn: number): void {
    let message: string;

    if (turn === 0) {
      const master = this.campaignService.master();

      message = master.me
        ? 'Your turn, Zargon'
        : `Turn for Zargon (${this.campaignService.master().handle})`;
    } else {
      this.dungeonService.selectMonster(null, false);

      const membership = this.campaignService.memberships()[turn - 1];

      message = membership.me
        ? `Your turn, ${membership.character!.name}`
        : `Turn for ${membership.character!.name} (${membership.user.handle})`;

      this.centerActiveHero();
    }
    this.toastService.show({
      message: message,
    });
  }

  private adventuresListen(): void {
    this.dungeonService.adventuresSocket.on('downFinishAdventure', () => {
      const campaignId = this.campaignService.campaign().id;
      const adventureTemplateName = this.campaignService.campaign().adventure!.template.name;

      this.campaignsApiService
        .get(this.campaignService.campaign().id)
        .pipe(
          tap((campaign) => {
            this.campaignService.campaign.set(campaign);

            this.toastService.show({
              message: `The adventure ${adventureTemplateName} has finished`,
            });

            void this.router.navigate(['home', 'campaigns', campaignId, 'town']);
          }),
        )
        .subscribe();
    });

    this.dungeonService.adventuresSocket.on('downEndTurnMaster', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;

      endTurnMaster(dungeon, data);

      this.campaignService.campaign.update((campaign) => {
        return {
          ...campaign,
          adventure: {
            ...campaign.adventure!,
            turn: 1,
            dungeon: dungeon,
          },
        };
      });

      this.dungeonService.hwfeMonstersUpdate();

      this.endTurnToast(1);
    });

    this.dungeonService.adventuresSocket.on('downEndTurnHero', (data) => {
      endTurnHero(
        this.campaignService.campaign().adventure!.dungeon,
        data.heroId,
        data.actionPoints,
        data.movementPoints,
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: data.turn,
          dungeon: campaign.adventure!.dungeon,
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();

      this.endTurnToast(data.turn);
    });

    this.dungeonService.adventuresSocket.on('downMoveHero', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const hero = dungeon.heroes.find((h) => h.id === data.heroId)!;

      moveHero(dungeon, hero.id, data.adj);

      cellsUpdateLos(
        dungeon.cells,
        dungeon.heroes.map((h) => cellAt(dungeon.cells, h.x, h.y)!),
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: dungeon,
        },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downMoveMonster', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;

      moveMonster(dungeon, data.monsterId, data.adj);

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: dungeon,
        },
      }));

      this.dungeonService.selectMonster(data.monsterId, false);

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeMonstersUpdate();
    });

    this.dungeonService.adventuresSocket.on('downSelectMonster', (id) => {
      this.dungeonService.selectMonster(id, true);
    });

    this.dungeonService.adventuresSocket.on('downOpenDoor', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const hero = dungeon.heroes.find((h) => h.id === data.heroId)!;

      openDoor(dungeon, hero.x, hero.y, data.adj)!;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: dungeon,
        },
      }));

      cellsUpdateLos(
        dungeon.cells,
        dungeon.heroes.map((h) => cellAt(dungeon.cells, h.x, h.y)!),
      );

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downEquipItem', (heroId, backpackItemId) => {
      const inventory = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!.inventory;
      const backpackItem = inventory.backpack.items.find((item) => item.id === backpackItemId)!;

      inventory.gear[HwItemSlots[backpackItem.name]!] = backpackItem;
      inventory.backpack.items = inventory.backpack.items.filter(
        (item) => item.id !== backpackItemId,
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downUnequipItem', (heroId, slot) => {
      const inventory = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!.inventory;
      const gearItem = inventory.gear[slot]!;

      inventory.backpack.items.push(gearItem);
      inventory.gear[slot] = null;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downDropItem', (heroId, backpackItemId) => {
      const hero = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!;
      const inventory = hero.inventory;
      const backpackItem = inventory.backpack.items.find((item) => item.id === backpackItemId)!;
      const cell = cellAt(
        this.campaignService.campaign().adventure!.dungeon.cells,
        hero.x,
        hero.y,
      )!;
      const loot = cell.loot;

      inventory.backpack.items = inventory.backpack.items.filter(
        (item) => item.id !== backpackItemId,
      );
      loot.items.push(backpackItem);

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
            cells: campaign.adventure!.dungeon.cells.map((c) => {
              if (!sameCell(c, cell)) {
                return c;
              }

              return {
                ...c,
                loot: { ...loot },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeCellsUpdate();
    });

    this.dungeonService.adventuresSocket.on('downDestroyItem', (heroId, backpackItemId) => {
      const hero = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!;
      const inventory = hero.inventory;

      inventory.backpack.items = inventory.backpack.items.filter(
        (item) => item.id !== backpackItemId,
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downPickupItem', (heroId, lootItemId) => {
      const hero = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!;
      const inventory = hero.inventory;
      const cell = cellAt(
        this.campaignService.campaign().adventure!.dungeon.cells,
        hero.x,
        hero.y,
      )!;
      const loot = cell.loot;
      const lootItem = loot.items.find((item) => item.id === lootItemId)!;

      loot.items = loot.items.filter((item) => item.id !== lootItemId);
      inventory.backpack.items.push(lootItem);

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
            cells: campaign.adventure!.dungeon.cells.map((c) => {
              if (!sameCell(c, cell)) {
                return c;
              }

              return {
                ...c,
                loot: { ...loot },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeCellsUpdate();
    });

    this.dungeonService.adventuresSocket.on('downPickupGold', (heroId, amount) => {
      const hero = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!;
      const inventory = hero.inventory;
      const cell = cellAt(
        this.campaignService.campaign().adventure!.dungeon.cells,
        hero.x,
        hero.y,
      )!;
      const loot = cell.loot;

      loot.gold -= amount;
      inventory.backpack.gold += amount;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((h) => {
              if (h.id !== heroId) {
                return h;
              }

              return {
                ...h,
                movementPoints: h.movementPoints - 1,
                inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
              };
            }),
            cells: campaign.adventure!.dungeon.cells.map((c) => {
              if (!sameCell(c, cell)) {
                return c;
              }

              return {
                ...c,
                loot: { ...loot },
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeCellsUpdate();
    });

    this.dungeonService.adventuresSocket.on('downSearch', (heroId) => {
      const hero = this.campaignService
        .campaign()
        .adventure!.dungeon.heroes.find((h) => h.id === heroId)!;
      const allCells = this.campaignService.campaign().adventure!.dungeon.cells;

      const searchCells = searchedCells(allCells, cellAt(allCells, hero.x, hero.y)!);

      this.campaignService.campaign.update((campaign) => {
        const updatedCells = campaign.adventure!.dungeon.cells.map((c) =>
          cellAt(searchCells, c.x, c.y)
            ? {
                ...c,
                searched: true,
                floorTrap: { ...c.floorTrap, found: true },
                feature: { ...c.feature, trap: { ...c.feature.trap, found: true } },
                door: { ...c.door, trap: { ...c.door.trap, found: true } },
              }
            : c,
        );

        searchSecondaryCells(
          searchCells,
          updatedCells,
          this.campaignService.campaign().adventure!.dungeon.cells,
        );

        return {
          ...campaign,
          adventure: {
            ...campaign.adventure!,
            dungeon: {
              ...campaign.adventure!.dungeon,
              heroes: campaign.adventure!.dungeon.heroes.map((h) => {
                if (h.id !== heroId) {
                  return h;
                }

                return {
                  ...h,
                  actionPoints: h.actionPoints - 1,
                };
              }),
              cells: updatedCells,
            },
          },
        };
      });

      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeCellsUpdate();
    });
  }
}
