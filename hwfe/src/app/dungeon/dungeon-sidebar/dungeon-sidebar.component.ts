import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DirectionIcons, Directions } from '@hw/shared/directions';
import { HwCreature } from '@hw/shared/dungeon';
import { filter, from, switchMap } from 'rxjs';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { ViewportService } from '../../map/services/viewport.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { WhoCharacterComponent } from '../../shared/who-character/who-character.component';
import { WhoMonsterComponent } from '../../shared/who-monster/who-monster.component';
import { SidebarButtonAction } from '../../sidebar/sidebar-button/sidebar-button.component';
import { SidebarButton, SidebarComponent } from '../../sidebar/sidebar.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { DungeonService } from '../services/dungeon.service';

@Component({
  selector: 'app-dungeon-sidebar',
  imports: [SidebarComponent, WhoCharacterComponent, WhoMonsterComponent, NgTemplateOutlet],
  templateUrl: './dungeon-sidebar.component.html',
  styleUrl: './dungeon-sidebar.component.css',
})
export class DungeonSidebarComponent {
  private router = inject(Router);
  private adventuresApiService = inject(AdventuresApiService);
  public dungeonService = inject(DungeonService);
  public campaignService = inject(CampaignService);
  private dialogService = inject(DialogService);
  private viewportService = inject(ViewportService);

  public buttons = computed<SidebarButton[]>(() => {
    return [
      this.backButton(),
      this.endTurnButton(),
      this.moveButton(),
      this.openDoorButton(),
      this.centerButton(),
      this.stopButton(),
    ].filter((button) => !!button);
  });

  private backButton(): SidebarButton {
    return {
      icon: 'arrow-uturn-left',
      callback: (): void => {
        void this.router.navigate(['home', 'campaigns']);
      },
    };
  }

  private endTurnButton(): SidebarButton {
    const master = this.campaignService.master();
    const activePlayer = this.dungeonService.activePlayer();

    return {
      icon: 'forward',
      disabled: !activePlayer?.me,
      callback: (): void => {
        (master.me
          ? this.adventuresApiService.endTurnMaster(this.campaignService.campaign().adventure!.id)
          : this.adventuresApiService.endTurnHero(this.campaignService.campaign().adventure!.id)
        ).subscribe();
      },
    };
  }

  private moveButton(): SidebarButton {
    const adventure = this.campaignService.campaign().adventure!;
    const master = this.campaignService.master();
    const activePlayer = this.dungeonService.activePlayer();
    const activeHero = this.dungeonService.activeHero();

    const actions: SidebarButtonAction[] = [];

    let creature: HwCreature | null = null;

    if (activeHero?.me) {
      creature = activeHero;
    } else if (activePlayer?.me && master.me) {
      creature = this.dungeonService.selectedMonster();
    }

    if (creature) {
      actions.push(
        ...Directions.map((dir) => ({
          icon: DirectionIcons[dir],
          disabled: !this.dungeonService.canWalk(creature, dir),
          callback: (): void => {
            (creature.alignment === 'HERO'
              ? this.adventuresApiService.moveHero(adventure.id, dir)
              : this.adventuresApiService.moveMonster(adventure.id, creature.id, dir)
            ).subscribe();
          },
        })),
      );
    }

    return {
      icon: 'arrows-pointing-out',
      autoClose: false,
      disabled: !creature || actions.every((a) => a.disabled),
      actions: actions,
    };
  }

  private openDoorButton(): SidebarButton | null {
    if (this.campaignService.master().me) {
      return null;
    }

    const adventure = this.campaignService.campaign().adventure!;
    const activeHero = this.dungeonService.activeHero();

    const actions: SidebarButtonAction[] = [];

    if (activeHero) {
      actions.push(
        ...Directions.map((dir) => ({
          icon: DirectionIcons[dir],
          disabled: !this.dungeonService.canOpenDoor(activeHero, dir),
          callback: (): void => {
            this.adventuresApiService.openDoor(adventure.id, dir).subscribe();
          },
        })),
      );
    }

    return {
      icon: 'open-door',
      autoClose: false,
      disabled: !activeHero || actions.every((a) => a.disabled),
      actions: actions,
    };
  }

  private centerButton(): SidebarButton {
    const master = this.campaignService.master();
    const activePlayer = this.dungeonService.activePlayer();
    const activeHero = this.dungeonService.activeHero();
    const myHero = this.dungeonService.myHero();

    return {
      icon: 'map-pin',
      disabled: master.me && activePlayer?.me,
      callback: (): void => {
        if (master.me) {
          this.viewportService.center(activeHero!.x, activeHero!.y);
        } else {
          this.viewportService.center(myHero!.x, myHero!.y);
        }
      },
    };
  }

  private stopButton(): SidebarButton | null {
    const master = this.campaignService.master();
    const adventure = this.campaignService.campaign().adventure!;

    if (!master.me) {
      return null;
    }

    return {
      icon: 'stop',
      color: 'warning',
      callback: (): void => {
        const dialog: LazyDialog<
          ConfirmationDialogComponent,
          ConfirmationDialogData,
          ConfirmationDialogResult
        > = {
          importFn: () =>
            import('../../shared/confirmation-dialog/confirmation-dialog.component').then(
              (m) => m.ConfirmationDialogComponent,
            ),
        };

        from(
          this.dialogService.open(dialog, {
            title: 'Finish the adventure',
            question: 'Are you sure you want to finish the adventure?',
            color: 'warning',
          }),
        )
          .pipe(
            switchMap((dialogRef) => dialogRef.afterClosed$),
            filter((confirmed) => !!confirmed),
            switchMap(() => this.adventuresApiService.finishAdventure(adventure.id)),
          )
          .subscribe();
      },
    };
  }
}
