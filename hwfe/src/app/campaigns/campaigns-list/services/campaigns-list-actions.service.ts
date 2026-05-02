import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HwCampaign } from '../../../../../../shared/dist/shared/src/campaigns/campaign.interface';
import { HwMembership } from '../../../../../../shared/dist/shared/src/memberships/membership.interface';
import { MembershipsApiService } from '../../../memberships/memberships-api.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppCardAction, AppCardMiniAction } from '../../../ui/card/card.component';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
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

@Injectable()
export class CampaignsListActionsService {
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private campaignsApiService = inject(CampaignsApiService);
  private membershipsApiService = inject(MembershipsApiService);

  public inviteAction(campaign: HwCampaign): AppCardAction {
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
          campaign: campaign,
        });
      },
    };
  }

  public joinAction(campaign: HwCampaign): AppCardAction {
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

        const membership = campaign.memberships.find((m) => m.me) as HwMembership;

        void this.dialogService.open(dialog, {
          membershipId: membership.id,
        });
      },
    };
  }

  public abandonAction(membership: HwMembership): AppCardAction {
    return {
      label: 'Abandon',
      color: 'warning',
      action: (): void => {
        void this.toggleMembership(membership, true);
      },
    };
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

  public playAction(campaign: HwCampaign): AppCardAction {
    return {
      label: 'Play',
      action: (): void => {
        void this.router.navigate(['home', 'campaigns', campaign.id]);
      },
    };
  }

  public deleteMiniAction(campaign: HwCampaign): AppCardMiniAction {
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
                switchMap(() => this.campaignsApiService.delete(campaign.id)),
              )
              .subscribe();
          });
      },
    };
  }

  public editMiniAction(campaign: HwCampaign): AppCardMiniAction {
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
          campaignId: campaign.id,
          dto: {
            name: campaign.name,
            aoo: campaign.ruleset.aoo,
            movement: campaign.ruleset.movement,
          },
        });
      },
    };
  }
}
