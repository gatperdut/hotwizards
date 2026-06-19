import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { DirectionOffsets } from '@hw/shared/directions';
import { cellAt, cellsUpdateLos, sameCell } from '@hw/shared/dungeon';
import { HwItemSlots } from '@hw/shared/inventory';
import {
  ClosedDoorSpritePath,
  ClosedToOpenDoorSpritePaths,
  heroSpritePath,
  monsterSpritePath,
} from '@hw/shared/sprites';
import { forkJoin, tap } from 'rxjs';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { CanvasLoadingComponent } from '../map/canvas-loading/canvas-loading.component';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import { DungeonSidebarComponent } from './dungeon-sidebar/dungeon-sidebar.component';
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
      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: 1,
          dungeon: {
            ...campaign.adventure!.dungeon,
            monsters: campaign.adventure!.dungeon.monsters.map((monster) => {
              return {
                ...monster,
                movementPoints: data.monsters[monster.id].movementPoints,
                maxMovementPoints: data.monsters[monster.id].movementPoints,
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeMonstersUpdate();

      this.endTurnToast(1);
    });

    this.dungeonService.adventuresSocket.on('downEndTurnHero', (data) => {
      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: data.turn,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((hero) => {
              if (data.heroId !== hero.id) {
                return hero;
              }

              return {
                ...hero,
                movementPoints: data.movementPoints,
                maxMovementPoints: data.movementPoints,
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();

      this.endTurnToast(data.turn);
    });

    this.dungeonService.adventuresSocket.on('downMoveHero', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const hero = dungeon.heroes.find((h) => h.id === data.heroId)!;
      const leftCell = cellAt(dungeon.cells, hero.x, hero.y)!;
      const enteredCell = cellAt(dungeon.cells, data.cell.x, data.cell.y)!;

      const cells = dungeon.cells.map((c) => {
        if (sameCell(c, leftCell)) {
          return { ...c, creatureId: null };
        }

        if (sameCell(c, enteredCell)) {
          return { ...c, creatureId: data.heroId };
        }

        return c;
      });

      const heroes = dungeon.heroes.map((h) =>
        h.id === hero.id
          ? {
              ...h,
              spritePath: heroSpritePath(h.klass, h.gender, data.dir),
              direction: data.dir,
              x: data.cell.x,
              y: data.cell.y,
              movementPoints: h.movementPoints - 1,
            }
          : h,
      );

      cellsUpdateLos(
        cells,
        heroes.map((h) => cellAt(cells, h.x, h.y)!),
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...dungeon,
            heroes: heroes,
            cells: cells,
          },
        },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.updateVisibility();
    });

    this.dungeonService.adventuresSocket.on('downMoveMonster', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const monster = dungeon.monsters.find((m) => m.id === data.monsterId)!;
      const leftCell = cellAt(dungeon.cells, monster.x, monster.y)!;
      const enteredCell = cellAt(dungeon.cells, data.cell.x, data.cell.y)!;

      const cells = dungeon.cells.map((c) => {
        if (sameCell(c, leftCell)) {
          return { ...c, creatureId: null };
        }

        if (sameCell(c, enteredCell)) {
          return { ...c, creatureId: data.monsterId };
        }

        return c;
      });

      const monsters = dungeon.monsters.map((m) => {
        if (m.id !== data.monsterId) {
          return m;
        }

        this.dungeonService.selectMonster(m.id, false);

        return {
          ...m,
          spritePath: monsterSpritePath(m.type!, data.dir),
          direction: data.dir,
          x: data.cell.x,
          y: data.cell.y,
          movementPoints: m.movementPoints - 1,
        };
      });

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...dungeon,
            monsters: monsters,
            cells: cells,
          },
        },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeMonstersUpdate();
      this.dungeonService.updateVisibility();
    });

    this.dungeonService.adventuresSocket.on('downSelectMonster', (id) => {
      this.dungeonService.selectMonster(id, true);
    });

    this.dungeonService.adventuresSocket.on('downOpenDoor', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const hero = dungeon.heroes.find((h) => h.id === data.heroId)!;
      const cell = cellAt(
        dungeon.cells,
        hero.x + DirectionOffsets[data.dir].x,
        hero.y + DirectionOffsets[data.dir].y,
      )!;

      const cells = dungeon.cells.map((c) => {
        if (sameCell(c, cell)) {
          return {
            ...c,
            door: {
              ...c.door!,
              open: true,
              spritePath: ClosedToOpenDoorSpritePaths[c.door!.spritePath as ClosedDoorSpritePath],
            },
          };
        }

        return c;
      });

      const heroes = dungeon.heroes.map((h) =>
        h.id === hero.id
          ? {
              ...h,
              spritePath: heroSpritePath(h.klass, h.gender, data.dir),
              direction: data.dir,
              movementPoints: h.movementPoints - 1,
            }
          : h,
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...dungeon,
            heroes: heroes,
            cells: cells,
          },
        },
      }));

      cellsUpdateLos(
        cells,
        heroes.map((h) => cellAt(cells, h.x, h.y)!),
      );

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.updateVisibility();
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
  }
}
