import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AppCardAction, CardComponent } from '../../ui/card/card.component';
import { MyCampaign } from '../types/my-campaign.type';

@Component({
  selector: 'app-campaign',
  imports: [CardComponent, NgTemplateOutlet],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
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
        console.log('Invite');
      },
    },
  ]);
}
