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
import { HwCampaignSearchDto, HwUserAny, PaginationMeta } from '@hw/shared';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { CharactersApiService } from '../../characters/services/characters-api.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
import { UsersApiService } from '../../users/users-api.service';
import { CampaignComponent } from '../campaign/campaign.component';
import { CampaignsFilterComponent } from '../campaigns-filter/campaigns-filter.component';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { HwfeCampaign, HwfeMembership } from '../types/my-campaign.type';

@Component({
  selector: 'app-my-campaigns',
  imports: [CampaignsFilterComponent, PaginatorComponent, CampaignComponent, JsonPipe],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private usersApiService = inject(UsersApiService);
  private campaignsApiService = inject(CampaignsApiService);
  private membershipsApiService = inject(MembershipsApiService);
  private charactersApiService = inject(CharactersApiService);
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.model();
      this.page.set(0);
    });
  }

  public model = signal<HwCampaignSearchDto>({
    term: '',
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

  private resource = rxResource<HwfeCampaign[], HwCampaignSearchDto>({
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
            switchMap(({ usersExt, memberships }) => {
              return this.charactersApiService
                .get({
                  ids: memberships.flatMap((m) => (m.characterId ? [m.characterId] : [])),
                })
                .pipe(map((characters) => ({ usersExt, memberships, characters })));
            }),
            map(({ usersExt, memberships, characters }) => {
              const userId = this.authService.userId();

              const userMap = Object.fromEntries(
                usersExt.map((userExt) => {
                  return userExt.id === userId
                    ? [userId, this.authService.user()]
                    : [userExt.id, userExt];
                }),
              );

              const membershipMap = Object.fromEntries(
                memberships.map((membership) => [membership.id, membership]),
              );

              const characterMap = Object.fromEntries(
                characters.map((character) => [character.id, character]),
              );

              return campaigns.map((campaign) => ({
                id: campaign.id,
                name: campaign.name,
                createdAt: campaign.createdAt,
                master: userMap[campaign.masterId] as HwUserAny,
                memberships: campaign.membershipIds
                  .filter((mid) => mid !== campaign.masterId)
                  .map((membershipId): HwfeMembership => {
                    const membership = membershipMap[membershipId];

                    return {
                      id: membership.id,
                      status: membership.status,
                      joinedAt: membership.joinedAt,
                      character: membership.characterId
                        ? characterMap[membership.characterId]
                        : undefined,
                      user: userMap[membership.userId] as HwUserAny,
                    };
                  }),
              }));
            }),
          );
        }),
      ),
  });

  public campaigns = computed(() => this.resource.value() ?? []);

  public loading = computed(() => this.resource.isLoading());
}
