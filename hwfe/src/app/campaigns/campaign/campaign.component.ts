import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { AppCardAction, CardComponent } from '../../ui/card/card.component';
import { DialogService } from '../../ui/dialog/services/dialog.service';
import {
  CampaignInviteDialogComponent,
  CampaignInviteDialogData,
  CampaignInviteDialogResult,
} from '../campaign-invite-dialog/campaign-invite-dialog.component';
import { MyCampaign } from '../types/my-campaign.type';

@Component({
  selector: 'app-campaign',
  imports: [CardComponent, NgTemplateOutlet],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
  private dialogService = inject(DialogService);

  public campaign = input.required<MyCampaign>();

  public master = computed(() => this.campaign().master);

  public activeMembers = computed(() =>
    this.campaign().members.filter((member) => member.status === 'ACCEPTED'),
  );

  public pendingMembers = computed(() =>
    this.campaign().members.filter((member) => member.status === 'PENDING'),
  );

  public actions = signal<AppCardAction[]>([
    {
      label: 'Invite',
      action: (): void => {
        this.dialogService
          .open<
            CampaignInviteDialogComponent,
            CampaignInviteDialogData,
            CampaignInviteDialogResult
          >(CampaignInviteDialogComponent, {
            campaign: this.campaign(),
          })
          .afterClosed$.subscribe((confirmed) => {
            console.log('DIALOG RESULT', confirmed);
          });
      },
    },
  ]);
}
