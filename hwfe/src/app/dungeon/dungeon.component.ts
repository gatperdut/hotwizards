import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { HwHero, HwMonster } from '@hw/shared/dungeon';
import { forkJoin, tap } from 'rxjs';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import { DungeonSidebarComponent } from './dungeon-sidebar/dungeon-sidebar.component';
import { DungeonService } from './services/dungeon.service';

@Component({
  selector: 'app-dungeon',
  imports: [DungeonSidebarComponent],
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
          this.dungeonService.setup();
        }),
        tap(() => {
          this.viewportService.viewport.setZoom(3);
          this.viewportService.center(28, 18);
        }),
      )
      .subscribe();
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

    this.dungeonService.adventuresSocket.on('downNextTurn', (data) => {
      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        adventure: {
          ...campaign.adventure!,
          turn: data.turn,
          dungeon: {
            ...campaign.adventure!.dungeon,
            heroes: campaign.adventure!.dungeon.heroes.map((hero) => {
              const updatedHero = data.modifiedCreatures.find((c) => c.id === hero.id)!;
              if (!updatedHero) {
                return hero;
              }
              return {
                ...hero,
                movementPoints: updatedHero.movementPoints,
              };
            }),
            monsters: campaign.adventure!.dungeon.monsters.map((monster) => {
              const updatedMonster = data.modifiedCreatures.find((c) => c.id === monster.id)!;
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

      this.dungeonService.hwfeHeroesUpdate();
      this.dungeonService.hwfeMonstersUpdate();

      let message: string;

      if (data.turn === 0) {
        const master = this.campaignService.master();

        message = master.me
          ? 'Your turn, Zargon'
          : `Turn for Zargon (${this.campaignService.master().handle})`;
      } else {
        this.dungeonService.selectMonster(null);

        const membership = this.campaignService.memberships()[data.turn - 1];

        message = membership.me
          ? `Your turn, ${membership.character!.name}`
          : `Turn for ${membership.character!.name} (${membership.user.handle})`;
      }
      this.toastService.show({
        message: message,
      });
    });

    this.dungeonService.adventuresSocket.on('downUpdate', (data) => {
      const dungeon = this.campaignService.campaign().adventure!.dungeon;

      dungeon.heroes = dungeon.heroes.map((hero) => {
        const updatedHero = data.modifiedCreatures.find((c) => c.id === hero.id) as
          | HwHero
          | undefined;

        if (!updatedHero) {
          return hero;
        }

        return {
          ...updatedHero,
          me: hero.me,
        };
      });

      dungeon.monsters = dungeon.monsters.map((monster) => {
        const updatedMonster = data.modifiedCreatures.find((c) => c.id === monster.id) as
          | HwMonster
          | undefined;

        if (!updatedMonster) {
          return monster;
        }

        return updatedMonster;
      });

      dungeon.cells = dungeon.cells.map((cell) => {
        const updatedCell = data.modifiedCells.find((c) => c.x === cell.x && c.y === cell.y)!;

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
      this.dungeonService.selectMonster(id);
    });
  }
}
