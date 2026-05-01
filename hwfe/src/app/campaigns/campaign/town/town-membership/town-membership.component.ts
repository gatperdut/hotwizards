import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { KlassesService } from '@hw/hwfe/app/characters/services/klasses.service';
import { WhoComponent } from '@hw/hwfe/app/shared/who/who.component';
import {
  AppCardAction,
  AppCardMiniAction,
  CardComponent,
} from '@hw/hwfe/app/ui/card/card.component';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import {
  CampaignsListDownstream,
  CampaignsListUpstream,
  HwCharacter,
  HwMembership,
  MembershipsDownstream,
  MembershipsUpstream,
} from '@hw/shared';
import { Socket } from 'socket.io-client';

@Component({
  selector: 'app-town-membership',
  imports: [CardComponent, WhoComponent],
  templateUrl: './town-membership.component.html',
  styleUrl: './town-membership.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownMembershipComponent {
  public klassesService = inject(KlassesService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);

  public membership = input.required<HwMembership>();

  public character = computed(() => this.membership().character as HwCharacter);

  private campaignsSocket!: Socket<CampaignsListDownstream, CampaignsListUpstream>;
  private membershipsSocket!: Socket<MembershipsDownstream, MembershipsUpstream>;

  constructor() {
    this.campaignsSocket = this.socketService.socket('campaigns', this.destroyRef);
    this.membershipsSocket = this.socketService.socket('memberships', this.destroyRef);

    // this.campaignsListen();
    // this.membershipsListen();
  }

  public actions = computed(() => {
    const result: AppCardAction[] = [];

    result.push(this.buyAction());

    return result;
  });

  public miniactions = computed(() => {
    const result: AppCardMiniAction[] = [];

    return result;
  });

  private buyAction(): AppCardAction {
    return {
      label: 'Buy',
      color: 'primary',
      action: (): void => {
        //TODO
      },
    };
  }
}
