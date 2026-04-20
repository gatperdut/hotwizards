import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AppCardAction, CardComponent } from '../../ui/card/card.component';
import { DialogService } from '../../ui/dialog/services/dialog.service';
import {
  CampaignInviteDialogComponent,
  CampaignInviteDialogData,
  CampaignInviteDialogResult,
} from '../campaign-invite-dialog/campaign-invite-dialog.component';
import {
  CampaignJoinDialogComponent,
  CampaignJoinDialogData,
  CampaignJoinDialogResult,
} from '../campaign-join-dialog/campaign-join-dialog.component';
import { MyCampaign } from '../types/my-campaign.type';

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

  public campaign = input.required<MyCampaign>();

  public master = computed(() => this.campaign().master);

  public activeMembers = computed(() =>
    this.campaign().members.filter((member) => member.status === 'ACCEPTED'),
  );

  public pendingMembers = computed(() =>
    this.campaign().members.filter((member) => member.status === 'PENDING'),
  );

  public isMaster = computed(() => this.master().id === this.authService.user()!.id);

  public isPending = computed(() =>
    this.pendingMembers()
      .map((m) => m.id)
      .includes(this.authService.user()!.id),
  );

  public isActive = computed(() =>
    this.activeMembers()
      .map((m) => m.id)
      .includes(this.authService.user()!.id),
  );

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    if (this.isMaster()) {
      result.push(this.inviteAction());
    } else if (this.isPending()) {
      result.push(this.joinAction());
    }

    return result;
  });

  private inviteAction(): AppCardAction {
    return {
      label: 'Invite',
      action: (): void => {
        this.dialogService.open<
          CampaignInviteDialogComponent,
          CampaignInviteDialogData,
          CampaignInviteDialogResult
        >(CampaignInviteDialogComponent, {
          campaign: this.campaign(),
        });
      },
    };
  }

  private joinAction(): AppCardAction {
    return {
      label: 'Join',
      action: (): void => {
        this.dialogService.open<
          CampaignJoinDialogComponent,
          CampaignJoinDialogData,
          CampaignJoinDialogResult
        >(CampaignJoinDialogComponent, {
          campaign: this.campaign(),
        });
      },
    };
  }
}
