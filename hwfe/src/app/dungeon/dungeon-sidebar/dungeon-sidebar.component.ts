import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, from, switchMap } from 'rxjs';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
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
  imports: [SidebarComponent, WhoComponent],
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
    const adventure = this.dungeonService.adventure();
    const activePlayer = this.dungeonService.activePlayer();
    const activeHero = this.dungeonService.activeHero();
    const master = this.campaignService.master();

    return [
      {
        icon: 'arrow-uturn-left',
        callback: (): void => {
          void this.router.navigate(['home', 'campaigns']);
        },
      },
      {
        icon: 'forward',
        disabled: !activePlayer?.me,
        callback: (): void => {
          this.adventuresApiService.endTurn(adventure.id).subscribe();
        },
      },
      {
        icon: 'arrows-pointing-out',
        autoClose: false,
        disabled: !activeHero?.me,
        actions: [
          {
            icon: 'arrow-up-left',
            disabled: activeHero?.me ? !this.dungeonService.canWalk(activeHero, 'n') : true,
            callback: (): void => {
              console.log('north');
            },
          },
          {
            icon: 'arrow-up-right',
            disabled: activeHero?.me ? !this.dungeonService.canWalk(activeHero, 'e') : true,
            callback: (): void => {
              console.log('east');
            },
          },
          {
            icon: 'arrow-down-right',
            disabled: activeHero?.me ? !this.dungeonService.canWalk(activeHero, 's') : true,
            callback: (): void => {
              console.log('south');
            },
          },
          {
            icon: 'arrow-down-left',
            disabled: activeHero?.me ? !this.dungeonService.canWalk(activeHero, 'w') : true,
            callback: (): void => {
              console.log('south');
            },
          },
        ],
      },
      master.me
        ? {
            icon: 'stop',
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
          }
        : null,
    ].filter((button) => !!button);
  });
}
