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
import { HwHero, HwMonster } from '@hw/shared/dungeon';
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
      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: 1,
          dungeon: {
            ...campaign.adventure!.dungeon,
            monsters: campaign.adventure!.dungeon.monsters.map((monster) => {
              const updatedMonster = data.updatedMonsters.find((m) => m.id === monster.id)!;
              if (!updatedMonster) {
                return monster;
              }
              return {
                ...monster,
                movementPoints: updatedMonster.movementPoints,
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
              if (data.updatedHero.id !== hero.id) {
                return hero;
              }

              return {
                ...hero,
                movementPoints: data.updatedHero.movementPoints,
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

      const creature = [...dungeon.heroes, ...dungeon.monsters].find(
        (c) => c.id === data.creatureId,
      );

      dungeon.heroes = dungeon.heroes.map((hero) => {
        const updatedHero = data.creaturesMoved.find((c) => c.id === hero.id) as HwHero | undefined;

        if (!updatedHero) {
          return hero;
        }

        return {
          ...updatedHero,
          me: hero.me,
        };
      });

      dungeon.monsters = dungeon.monsters.map((monster) => {
        const updatedMonster = data.creaturesMoved.find((c) => c.id === monster.id) as
          | HwMonster
          | undefined;

        if (!updatedMonster) {
          return monster;
        }

        return updatedMonster;
      });

      dungeon.cells = dungeon.cells.map((cell) => {
        const updatedCell = data.cellsLeft.find((c) => c.x === cell.x && c.y === cell.y)!;

        if (updatedCell) {
          return updatedCell;
        }

        return cell;
      });

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: { ...campaign.adventure!, dungeon: dungeon },
      }));

      this.dungeonService.hwfeCellsUpdate();
      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeMonstersUpdate();
    });

    this.dungeonService.adventuresSocket.on('downSelectMonster', (id) => {
      this.dungeonService.selectMonster(id, true);
    });
  }
}
