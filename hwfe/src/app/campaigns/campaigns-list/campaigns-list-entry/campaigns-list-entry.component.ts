import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import {
  InfoDialogComponent,
  InfoDialogData,
  InfoDialogResult,
} from '@hw/hwfe/app/shared/info-dialog/info-dialog.component';
import { WhoComponent } from '@hw/hwfe/app/shared/who/who.component';
import { HwAdventure, HwCampaign, HwMembership } from '@hw/shared';
import { KlassesService } from '../../../characters/services/klasses.service';
import { AppCardAction, AppCardMiniAction, CardComponent } from '../../../ui/card/card.component';
import { DialogService, LazyDialog } from '../../../ui/dialog/services/dialog.service';
import { CampaignActionsService } from '../../services/campaign-actions.service';

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
  private campaignActionsService = inject(CampaignActionsService);

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
        this.campaignActionsService.toggleMembership(membership, false);
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

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.meMaster() && !this.hasAdventure()) {
      result.push(this.campaignActionsService.inviteAction(this.campaign()));
    }

    if (this.mePending() || (this.meActive() && !this.hasAdventure())) {
      result.push(this.campaignActionsService.abandonAction(this.membership()));
    }

    if (this.mePending() && !this.hasAdventure()) {
      result.push(this.campaignActionsService.joinAction(this.campaign()));
    }

    if (!this.mePending()) {
      result.push(this.campaignActionsService.playAction(this.campaign()));
    }

    return result;
  });

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    if (this.meMaster()) {
      result.push(this.campaignActionsService.deleteMiniAction(this.campaign()));
      result.push(this.campaignActionsService.editMiniAction(this.campaign()));
    }

    return result;
  });
}
