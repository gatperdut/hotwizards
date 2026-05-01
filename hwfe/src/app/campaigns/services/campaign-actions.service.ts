import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HwCampaign } from '../../../../../shared/dist/shared/src/campaigns/campaign.interface';
import { HwMembership } from '../../../../../shared/dist/shared/src/memberships/membership.interface';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppCardAction, AppCardMiniAction } from '../../ui/card/card.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  CampaignEditorDialogComponent,
  CampaignEditorDialogData,
  CampaignEditorDialogResult,
} from '../campaign-editor-dialog/campaign-editor-dialog.component';
import {
  CampaignInviteAcceptDialogComponent,
  CampaignInviteAcceptDialogData,
  CampaignInviteAcceptDialogResult,
} from '../campaign-invite-accept-dialog/campaign-invite-accept-dialog.component';
import {
  CampaignInviteDialogComponent,
  CampaignInviteDialogData,
  CampaignInviteDialogResult,
} from '../campaign-invite-dialog/campaign-invite-dialog.component';
import { CampaignsApiService } from './campaigns-api.service';

@Injectable({ providedIn: 'root' })
export class CampaignActionsService {
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private campaignsApiService = inject(CampaignsApiService);

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
            import('../campaign-invite-dialog/campaign-invite-dialog.component').then(
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
            import('../campaign-invite-accept-dialog/campaign-invite-accept-dialog.component').then(
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
            import('../../shared/confirmation-dialog/confirmation-dialog.component').then(
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
            import('../campaign-editor-dialog/campaign-editor-dialog.component').then(
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
