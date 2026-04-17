import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form } from '@angular/forms/signals';
import { HwCampaign, HwCampaignSearchDto, HwMembershipStatus, HwUserAny } from '@hw/shared';
import { forkJoin, map, switchMap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { UsersApiService } from '../../users/users-api.service';
import { CampaignsFilterComponent } from '../campaigns-filter/campaigns-filter.component';
import { CampaignsApiService } from '../services/campaigns-api.service';

type MyMember = HwUserAny & {
  status: HwMembershipStatus;
  joinedAt: Date;
};

type MyCampaign = Omit<HwCampaign, 'masterId' | 'memberIds' | 'membershipIds'> & {
  master: HwUserAny;
  members: MyMember[];
};

@Component({
  selector: 'app-my-campaigns',
  imports: [CampaignsFilterComponent, JsonPipe],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private usersApiService = inject(UsersApiService);
  private membershipsApiService = inject(MembershipsApiService);
  private authService = inject(AuthService);

  public model = signal<HwCampaignSearchDto>({
    term: '',
  });

  public form = form(this.model, (schemaPath) => {
    debounce(schemaPath.term, 400);
  });

  private resource = rxResource<MyCampaign[], HwCampaignSearchDto>({
    params: () => this.model(),
    stream: (request) =>
      this.campaignsApiService.mine().pipe(
        switchMap((campaigns) => {
          const userIds = [
            ...new Set(campaigns.flatMap((campaign) => [campaign.masterId, ...campaign.memberIds])),
          ];

          const membershipIds = [
            ...new Set(campaigns.flatMap((campaign) => campaign.membershipIds)),
          ];

          return forkJoin({
            usersExt: this.usersApiService.get({ ids: userIds }),
            memberships: this.membershipsApiService.get({ ids: membershipIds }),
          }).pipe(
            map(({ usersExt, memberships }) => {
              const userId = this.authService.userId();

              const userMap = Object.fromEntries(
                usersExt.map((userExt) => {
                  return userExt.id === userId
                    ? [userId, this.authService.user()]
                    : [userExt.id, userExt];
                }),
              );

              const membershipMap = Object.fromEntries(
                memberships.map((membership) => [membership.userId, membership]),
              );

              return campaigns.map((campaign) => ({
                id: campaign.id,
                name: campaign.name,
                createdAt: campaign.createdAt,
                master: userMap[campaign.masterId] as HwUserAny,
                members: campaign.memberIds.map(
                  (memberId) =>
                    ({
                      ...userMap[memberId],
                      status: membershipMap[memberId].status,
                      joinedAt: membershipMap[memberId].joinedAt,
                    }) as MyMember,
                ),
              }));
            }),
          );
        }),
      ),
  });

  public campaigns = computed(() => this.resource.value() ?? []);
}
