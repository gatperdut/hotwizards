import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HwCampaign, HwMembership } from '@hw/shared';
import { filter, switchMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { KlassesService } from '../../characters/services/klasses.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppCardAction, AppCardMiniAction, CardComponent } from '../../ui/card/card.component';
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
import { CampaignsApiService } from '../services/campaigns-api.service';

@Component({
  selector: 'app-campaign',
  imports: [CardComponent, NgTemplateOutlet],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  public klassesService = inject(KlassesService);
  private membershipsApiService = inject(MembershipsApiService);
  private campaignsApiService = inject(CampaignsApiService);

  public campaign = input.required<HwCampaign>();

  public membership = computed(
    () =>
      this.campaign().memberships.find(
        (m) => m.user.id === this.authService.userId(),
      ) as HwMembership,
  );

  public master = computed(() => this.campaign().master);

  public activeMemberships = computed(() =>
    this.campaign().memberships.filter((membership) => membership.status === 'ACTIVE'),
  );

  public pendingMemberships = computed(() =>
    this.campaign().memberships.filter((membership) => membership.status === 'PENDING'),
  );

  public isMaster = computed(() => this.master().id === this.authService.user()!.id);

  public isPending = computed(() =>
    this.pendingMemberships()
      .map((m) => m.user.id)
      .includes(this.authService.user()!.id),
  );

  public isActive = computed(() =>
    this.activeMemberships()
      .map((m) => m.user.id)
      .includes(this.authService.user()!.id),
  );

  public toggleMembership(membership: HwMembership, self: boolean): void {
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
            switchMap(() => this.membershipsApiService.delete(membership.id)),
          )
          .subscribe();
      });
  }

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.isMaster()) {
      result.push(this.inviteAction());
    }

    if (this.isPending() || this.isActive()) {
      result.push(this.abandonAction());
    }

    if (this.isPending()) {
      result.push(this.joinAction());
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
            import('../campaign-invite-dialog/campaign-invite-dialog.component').then(
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
            import('../campaign-invite-accept-dialog/campaign-invite-accept-dialog.component').then(
              (m) => m.CampaignInviteAcceptDialogComponent,
            ),
        };

        const membership = this.campaign().memberships.find(
          (m) => m.user.id === this.authService.userId(),
        ) as HwMembership;

        void this.dialogService.open(dialog, {
          membershipId: membership.id,
        });
      },
    };
  }

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    if (this.isMaster()) {
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
            import('../campaign-editor-dialog/campaign-editor-dialog.component').then(
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
                switchMap(() => this.campaignsApiService.delete(this.campaign().id)),
              )
              .subscribe();
          });
      },
    };
  }
}
