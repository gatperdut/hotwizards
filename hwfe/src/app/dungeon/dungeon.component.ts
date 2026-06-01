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
import { heroSpritePath, monsterSpritePath } from '@hw/shared/sprites';
import { forkJoin, tap } from 'rxjs';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { CanvasLoadingComponent } from '../map/canvas-loading/canvas-loading.component';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import { DungeonSidebarComponent } from './dungeon-sidebar/dungeon-sidebar.component';
import { DungeonService } from './services/dungeon.service';

@Component({
  selector: 'app-dungeon',
  imports: [CanvasLoadingComponent, DungeonSidebarComponent],
  templateUrl: './dungeon.component.html',
  styleUrl: './dungeon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverflowService, DungeonService, ViewportService, TextureService],
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
    this.dungeonService.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.dungeonService.adventuresSocket = this.socketService.socket(
      'adventures',
      this.destroyRef,
      {
        adventureId: this.campaignService.campaign().adventure!.id,
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
    this.dungeonService.campaignsSocket.on('downDeleteCampaign', (campaignId) => {
      if (campaignId !== this.campaignService.campaign().id) {
        return;
      }

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
      console.log('downEndTurnMaster', data);
      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: 1,
          dungeon: {
            ...campaign.adventure!.dungeon,
            monsters: campaign.adventure!.dungeon.monsters.map((monster) => {
              return { ...monster, movementPoints: monster.maxMovementPoints };
            }),
          },
        },
      }));

      this.dungeonService.hwfeMonstersUpdate();

      this.endTurnToast(1);
    });

    this.dungeonService.adventuresSocket.on('downEndTurnHero', (data) => {
      console.log('downEndTurnHero', data);
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
                movementPoints: hero.maxMovementPoints,
              };
            }),
          },
        },
      }));

      this.dungeonService.hwfeHeroesUpdate();

      this.endTurnToast(data.turn);
    });

    this.dungeonService.adventuresSocket.on('downMoveHero', (data) => {
      console.log('downMoveHero', data);
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const hero = dungeon.heroes.find((h) => h.id === data.creatureId)!;
      const leftCell = dungeon.cells.find((c) => c.x === hero.x && c.y === hero.y)!;
      const enteredCell = dungeon.cells.find((c) => c.x === data.cell.x && c.y === data.cell.y)!;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...dungeon,
            heroes: dungeon.heroes.map((h) =>
              h.id === hero.id
                ? {
                    ...h,
                    spritePath: heroSpritePath(h.klass, h.gender, data.dir),
                    direction: data.dir,
                    x: data.cell.x,
                    y: data.cell.y,
                  }
                : h,
            ),
            cells: dungeon.cells.map((c) => {
              if (c.x === leftCell.x && c.y === leftCell.y) {
                return { ...c, creatureId: null };
              }

              if (c.x === enteredCell.x && c.y === enteredCell.y) {
                return { ...c, creatureId: data.creatureId };
              }

              return c;
            }),
          },
        },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
    });

    this.dungeonService.adventuresSocket.on('downMoveMonster', (data) => {
      console.log('downMoveMonster', data);
      const dungeon = this.campaignService.campaign().adventure!.dungeon;
      const monster = dungeon.monsters.find((m) => m.id === data.creatureId)!;
      const leftCell = dungeon.cells.find((c) => c.x === monster.x && c.y === monster.y)!;
      const enteredCell = dungeon.cells.find((c) => c.x === data.cell.x && c.y === data.cell.y)!;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          dungeon: {
            ...dungeon,
            monsters: dungeon.monsters.map((m) =>
              m.id === data.creatureId
                ? {
                    ...m,
                    spritePath: monsterSpritePath(m.type!, data.dir),
                    direction: data.dir,
                    x: data.cell.x,
                    y: data.cell.y,
                  }
                : m,
            ),
            cells: dungeon.cells.map((c) => {
              if (c.x === leftCell.x && c.y === leftCell.y) {
                return { ...c, creatureId: null };
              }

              if (c.x === enteredCell.x && c.y === enteredCell.y) {
                return { ...c, creatureId: data.creatureId };
              }

              return c;
            }),
          },
        },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeMonstersUpdate();
    });

    this.dungeonService.adventuresSocket.on('downSelectMonster', (id) => {
      console.log('downSelectMonster', id);
      this.dungeonService.selectMonster(id, true);
    });
  }
}
