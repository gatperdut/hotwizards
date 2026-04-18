import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { debounce, form } from '@angular/forms/signals';
import {
  HwCampaign,
  HwCampaignSearchDto,
  HwMembershipStatus,
  HwUserAny,
  PaginationMeta,
} from '@hw/shared';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
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
  imports: [CampaignsFilterComponent, PaginatorComponent, JsonPipe],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private usersApiService = inject(UsersApiService);
  private membershipsApiService = inject(MembershipsApiService);
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.model();
      this.page.set(0);
    });
  }

  public model = signal<HwCampaignSearchDto>({
    term: '',
    pageSize: 1,
  });

  public form = form(this.model, (schemaPath) => {
    debounce(schemaPath.term, 400);
  });

  public page = signal<number>(0);

  public pages = signal<number>(0);

  public meta = signal<PaginationMeta>({
    page: 0,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  private resource = rxResource<MyCampaign[], HwCampaignSearchDto>({
    params: () => ({ ...this.model(), page: this.page() }),
    stream: (request) =>
      this.campaignsApiService.mine(request.params).pipe(
        tap((response) => {
          this.meta.set(response.meta);
          this.pages.set(response.meta.pages);
        }),
        map((response) => response.items),
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

  public loading = computed(() => this.resource.isLoading());
}
