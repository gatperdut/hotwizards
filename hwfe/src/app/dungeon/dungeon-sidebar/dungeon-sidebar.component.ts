import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DirectionIcons, Directions } from '@hw/shared/directions';
import { filter, from, switchMap } from 'rxjs';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { WhoMonsterComponent } from '../../shared/app-who-monster/who-monster.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { WhoComponent } from '../../shared/who/who.component';
import { SidebarButton, SidebarComponent } from '../../sidebar/sidebar.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { DungeonService } from '../services/dungeon.service';

@Component({
  selector: 'app-dungeon-sidebar',
  imports: [SidebarComponent, WhoComponent, WhoMonsterComponent, NgTemplateOutlet],
  templateUrl: './dungeon-sidebar.component.html',
  styleUrl: './dungeon-sidebar.component.css',
})
export class DungeonSidebarComponent {
  private router = inject(Router);
  private adventuresApiService = inject(AdventuresApiService);
  public dungeonService = inject(DungeonService);
  public campaignService = inject(CampaignService);
  private dialogService = inject(DialogService);

  public buttons = computed<SidebarButton[]>(() => {
    return [this.backButton(), this.endTurnButton(), this.moveButton(), this.stopButton()].filter(
      (button) => !!button,
    );
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
    const activeHero = this.dungeonService.activeHero();

    return {
      icon: 'arrows-pointing-out',
      autoClose: false,
      disabled:
        !activeHero?.me ||
        !Directions.filter((dir) => this.dungeonService.canWalk(activeHero, dir)).length,
      actions: Directions.map((dir) => ({
        icon: DirectionIcons[dir],
        disabled: activeHero?.me ? !this.dungeonService.canWalk(activeHero, dir) : true,
        callback: (): void => {
          this.adventuresApiService.moveHero(adventure.id, dir).subscribe();
        },
      })),
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
