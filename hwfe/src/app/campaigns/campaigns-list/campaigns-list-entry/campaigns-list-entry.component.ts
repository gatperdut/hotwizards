import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  InfoDialogComponent,
  InfoDialogData,
  InfoDialogResult,
} from '@hw/hwfe/app/shared/info-dialog/info-dialog.component';
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
import { OnlineMarkComponent } from '../../../users/online-mark/online-mark.component';
import {
  CampaignEditorDialogComponent,
  CampaignEditorDialogData,
  CampaignEditorDialogResult,
} from '../../campaign-editor-dialog/campaign-editor-dialog.component';
import {
  CampaignInviteAcceptDialogComponent,
  CampaignInviteAcceptDialogData,
  CampaignInviteAcceptDialogResult,
} from '../../campaign-invite-accept-dialog/campaign-invite-accept-dialog.component';
import {
  CampaignInviteDialogComponent,
  CampaignInviteDialogData,
  CampaignInviteDialogResult,
} from '../../campaign-invite-dialog/campaign-invite-dialog.component';
import { CampaignsApiService } from '../../services/campaigns-api.service';

@Component({
  selector: 'app-campaigns-list-entry',
  imports: [CardComponent, NgTemplateOutlet, OnlineMarkComponent],
  templateUrl: './campaigns-list-entry.component.html',
  styleUrl: './campaigns-list-entry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsListEntryComponent {
  private dialogService = inject(DialogService);
  public klassesService = inject(KlassesService);
  private membershipsApiService = inject(MembershipsApiService);
  private campaignsApiService = inject(CampaignsApiService);
  private router = inject(Router);

  public campaign = input.required<HwCampaign>();

  public membership = computed(() => this.campaign().memberships.find((m) => m.me) as HwMembership);

  public master = computed(() => this.campaign().master);

  public activeMemberships = computed(() =>
    this.campaign().memberships.filter((membership) => membership.status === 'ACTIVE'),
  );

  public hasActiveMemberships = computed(() => !!this.activeMemberships.length);

  public pendingMemberships = computed(() =>
    this.campaign().memberships.filter((membership) => membership.status === 'PENDING'),
  );

  public hasPendingMemberships = computed(() => !!this.pendingMemberships.length);

  public meMaster = computed(() => this.master().me);

  public mePending = computed(() => !!this.pendingMemberships().find((m) => m.me));

  public meActive = computed(() => !!this.activeMemberships().find((m) => m.me));

  public adventure: Signal<HwAdventure | undefined> = computed(() => this.campaign().adventure);

  public hasAdventure = computed(() => !!this.adventure());

  public informNoKickout(): void {
    const dialog: LazyDialog<InfoDialogComponent, InfoDialogData, InfoDialogResult> = {
      importFn: () =>
        import('../../../shared/info-dialog/info-dialog.component').then(
          (m) => m.InfoDialogComponent,
        ),
    };

    void this.dialogService.open(dialog, {
      title: 'Kick out',
      info: 'You cannot kick members out of the campaign while an adventure is running.',
    });
  }

  public toggleMembership(membership: HwMembership, self: boolean): void {
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
      result.push(this.inviteAction());
    }

    if (this.mePending() || (this.meActive() && !this.hasAdventure())) {
      result.push(this.abandonAction());
    }

    if (this.mePending() && !this.hasAdventure()) {
      result.push(this.joinAction());
    }

    if (!this.hasPendingMemberships()) {
      result.push(this.playAction());
    }

    return result;
  });

  private inviteAction(): AppCardAction {
    return {
      label: 'Invite',
      action: (): void => {
        const dialog: LazyDialog<
          CampaignInviteDialogComponent,
          CampaignInviteDialogData,
          CampaignInviteDialogResult
        > = {
          importFn: () =>
            import('../../campaign-invite-dialog/campaign-invite-dialog.component').then(
              (m) => m.CampaignInviteDialogComponent,
            ),
        };

        void this.dialogService.open(dialog, {
          campaign: this.campaign(),
        });
      },
    };
  }

  private abandonAction(): AppCardAction {
    return {
      label: 'Abandon',
      color: 'warning',
      action: (): void => {
        void this.toggleMembership(this.membership(), true);
      },
    };
  }

  private joinAction(): AppCardAction {
    return {
      label: 'Join',
      action: (): void => {
        const dialog: LazyDialog<
          CampaignInviteAcceptDialogComponent,
          CampaignInviteAcceptDialogData,
          CampaignInviteAcceptDialogResult
        > = {
          importFn: () =>
            import('../../campaign-invite-accept-dialog/campaign-invite-accept-dialog.component').then(
              (m) => m.CampaignInviteAcceptDialogComponent,
            ),
        };

        const membership = this.campaign().memberships.find((m) => m.me) as HwMembership;

        void this.dialogService.open(dialog, {
          membershipId: membership.id,
        });
      },
    };
  }

  private playAction(): AppCardAction {
    return {
      label: 'Play',
      action: (): void => {
        void this.router.navigate(['home', 'campaigns', this.campaign().id]);
      },
    };
  }

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    if (this.meMaster()) {
      result.push(this.deleteMiniAction());
      result.push(this.editMiniAction());
    }

    return result;
  });

  private editMiniAction(): AppCardMiniAction {
    return {
      icon: 'pencil',
      action: (): void => {
        const dialog: LazyDialog<
          CampaignEditorDialogComponent,
          CampaignEditorDialogData,
          CampaignEditorDialogResult
        > = {
          importFn: () =>
            import('../../campaign-editor-dialog/campaign-editor-dialog.component').then(
              (m) => m.CampaignEditorDialogComponent,
            ),
        };

        void this.dialogService.open(dialog, {
          campaignId: this.campaign().id,
          dto: {
            name: this.campaign().name,
            aoo: this.campaign().ruleset.aoo,
            movement: this.campaign().ruleset.movement,
          },
        });
      },
    };
  }

  private deleteMiniAction(): AppCardMiniAction {
    return {
      icon: 'trash',
      color: 'warning',
      action: (): void => {
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
            title: 'Delete campaign',
            question: 'Are you sure you want to delete the campaign?',
            color: 'warning',
          })
          .then((dialogRef) => {
            dialogRef.afterClosed$
              .pipe(
                filter((confirmed) => !!confirmed),
                switchMap(() => this.campaignsApiService.delete(this.campaign().id)),
              )
              .subscribe();
          });
      },
    };
  }
}
