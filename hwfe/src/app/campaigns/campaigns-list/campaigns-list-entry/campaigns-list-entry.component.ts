import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  InfoDialogComponent,
  InfoDialogData,
  InfoDialogResult,
} from '@hw/hwfe/app/shared/info-dialog/info-dialog.component';
import { WhoComponent } from '@hw/hwfe/app/shared/who/who.component';
import { HwAdventure, HwCampaign, HwMembership } from '@hw/shared';
import { filter, switchMap } from 'rxjs';
import { KlassesService } from '../../../characters/services/klasses.service';
import { MembershipsApiService } from '../../../memberships/memberships-api.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppCardAction, AppCardMiniAction, CardComponent } from '../../../ui/card/card.component';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
import { CampaignActionsService } from '../../services/campaign-actions.service';
import { CampaignsApiService } from '../../services/campaigns-api.service';

@Component({
  selector: 'app-campaigns-list-entry',
  imports: [CardComponent, WhoComponent],
  templateUrl: './campaigns-list-entry.component.html',
  styleUrl: './campaigns-list-entry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsListEntryComponent {
  private dialogService = inject(DialogService);
  public klassesService = inject(KlassesService);
  private membershipsApiService = inject(MembershipsApiService);
  private campaignsApiService = inject(CampaignsApiService);
  private campaignActionsService = inject(CampaignActionsService);
  private router = inject(Router);

  public campaign = input.required<HwCampaign>();

  public membership = computed(() => this.campaign().memberships.find((m) => m.me) as HwMembership);

  public master = computed(() => this.campaign().master);

  public activeMemberships = computed(() =>
    this.campaign().memberships.filter((m) => m.status === 'ACTIVE'),
  );

  public hasActiveMemberships = computed(() => !!this.activeMemberships().length);

  public pendingMemberships = computed(() =>
    this.campaign().memberships.filter((m) => m.status === 'PENDING'),
  );

  public hasPendingMemberships = computed(() => !!this.pendingMemberships().length);

  public meMaster = computed(() => this.master().me);

  public mePending = computed(() => !!this.pendingMemberships().find((m) => m.me));

  public meActive = computed(() => !!this.activeMemberships().find((m) => m.me));

  public adventure: Signal<HwAdventure | undefined> = computed(() => this.campaign().adventure);

  public hasAdventure = computed(() => !!this.adventure());

  public clickMembership(membership: HwMembership): void {
    if (this.meMaster()) {
      if (this.hasAdventure()) {
        this.cannotToggleMembership();
      } else {
        this.toggleMembership(membership, false);
      }
    }
  }

  private cannotToggleMembership(): void {
    const dialog: LazyDialog<InfoDialogComponent, InfoDialogData, InfoDialogResult> = {
      importFn: () =>
        import('../../../shared/info-dialog/info-dialog.component').then(
          (m) => m.InfoDialogComponent,
        ),
    };

    void this.dialogService.open(dialog, {
      title: 'Kick out of campaign',
      info: 'You cannot kick members out of a campaign while an adventure is running.',
    });
  }

  private toggleMembership(membership: HwMembership, self: boolean): void {
    const dialog: LazyDialog<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      ConfirmationDialogResult
    > = {
      importFn: () =>
        import('../../../shared/confirmation-dialog/confirmation-dialog.component').then(
          (m) => m.ConfirmationDialogComponent,
        ),
    };

    void this.dialogService
      .open(dialog, {
        title: self ? 'Abandon' : 'Kick out',
        question: self
          ? 'Are you sure you want to abandon the campaign?'
          : `Are you sure you want to kick ${membership.user.handle} out?`,
        color: 'warning',
      })
      .then((dialogRef) => {
        dialogRef.afterClosed$
          .pipe(
            filter((confirmed) => !!confirmed),
            switchMap(() =>
              self
                ? this.membershipsApiService.abandon(membership.id)
                : this.membershipsApiService.kickout(membership.id),
            ),
          )
          .subscribe();
      });
  }

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.meMaster() && !this.hasAdventure()) {
      result.push(this.campaignActionsService.inviteAction(this.campaign()));
    }

    if (this.mePending() || (this.meActive() && !this.hasAdventure())) {
      result.push(this.abandonAction());
    }

    if (this.mePending() && !this.hasAdventure()) {
      result.push(this.campaignActionsService.joinAction(this.campaign()));
    }

    result.push(this.campaignActionsService.playAction(this.campaign()));

    return result;
  });

  private abandonAction(): AppCardAction {
    return {
      label: 'Abandon',
      color: 'warning',
      action: (): void => {
        void this.toggleMembership(this.membership(), true);
      },
    };
  }

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    if (this.meMaster()) {
      result.push(this.campaignActionsService.deleteMiniAction(this.campaign()));
      result.push(this.campaignActionsService.editMiniAction(this.campaign()));
    }

    return result;
  });
}
