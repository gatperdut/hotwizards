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
import { HwCampaignSearchDto, HwUser, PaginationMeta } from '@hw/shared';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { CharactersApiService } from '../../characters/services/characters-api.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { RulesetsApiService } from '../../rulesets/services/rulesets-api.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { PaginatorComponent } from '../../ui/paginator/paginator.component';
import { UsersApiService } from '../../users/users-api.service';
import {
  CampaignEditorDialogComponent,
  CampaignEditorDialogData,
  CampaignInEditorDialogResult,
} from '../campaign-editor-dialog/campaign-editor-dialog.component';
import { CampaignComponent } from '../campaign/campaign.component';
import { CampaignsFilterComponent } from '../campaigns-filter/campaigns-filter.component';
import { CampaignsApiService } from '../services/campaigns-api.service';
import { HwfeCampaign, HwfeMembership } from '../types/my-campaign.type';

@Component({
  selector: 'app-my-campaigns',
  imports: [
    CampaignsFilterComponent,
    PaginatorComponent,
    CampaignComponent,
    JsonPipe,
    ButtonComponent,
  ],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private usersApiService = inject(UsersApiService);
  private campaignsApiService = inject(CampaignsApiService);
  private membershipsApiService = inject(MembershipsApiService);
  private rulesetsApiService = inject(RulesetsApiService);
  private charactersApiService = inject(CharactersApiService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);

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

          const rulesetIds = [...new Set(campaigns.flatMap((campaign) => campaign.rulesetId))];

          return forkJoin({
            users: this.usersApiService.get({ ids: userIds }),
            memberships: this.membershipsApiService.get({ ids: membershipIds }),
            rulesets: this.rulesetsApiService.get({ ids: rulesetIds }),
          }).pipe(
            switchMap(({ users, memberships, rulesets }) => {
              return this.charactersApiService
                .get({
                  ids: memberships.flatMap((m) => (m.characterId ? [m.characterId] : [])),
                })
                .pipe(map((characters) => ({ users, memberships, rulesets, characters })));
            }),
            map(({ users, memberships, rulesets, characters }) => {
              const userId = this.authService.userId();

              const userMap = Object.fromEntries(
                users.map((user) => {
                  return user.id === userId ? [userId, this.authService.user()] : [user.id, user];
                }),
              );

              const membershipMap = Object.fromEntries(
                memberships.map((membership) => [membership.id, membership]),
              );

              const rulesetMap = Object.fromEntries(
                rulesets.map((ruleset) => [ruleset.id, ruleset]),
              );

              const characterMap = Object.fromEntries(
                characters.map((character) => [character.id, character]),
              );

              return campaigns.map((campaign) => {
                const hwMaster = userMap[campaign.masterId] as HwUser;
                const hwRuleset = rulesetMap[campaign.rulesetId];

                return {
                  id: campaign.id,
                  name: campaign.name,
                  createdAt: campaign.createdAt,
                  master: { ...hwMaster, me: hwMaster.id === this.authService.userId() },
                  ruleset: { id: hwRuleset.id, aoo: hwRuleset.aoo, movement: hwRuleset.movement },
                  memberships: campaign.membershipIds.map((membershipId): HwfeMembership => {
                    const membership = membershipMap[membershipId];
                    const hwUser = userMap[membership.userId] as HwUser;
                    const me = hwUser.id === this.authService.userId();

                    return {
                      id: membership.id,
                      status: membership.status,
                      joinedAt: membership.joinedAt,
                      me: me,
                      character: membership.characterId
                        ? { ...characterMap[membership.characterId], me: me }
                        : undefined,
                      user: {
                        ...hwUser,
                        me: me,
                      },
                    };
                  }),
                };
              });
            }),
          );
        }),
      ),
  });

  public campaigns = computed(() => this.resource.value() ?? []);

  public loading = computed(() => this.resource.isLoading());

  public create(): void {
    const dialog: LazyDialog<
      CampaignEditorDialogComponent,
      CampaignEditorDialogData,
      CampaignInEditorDialogResult
    > = {
      importFn: () =>
        import('../campaign-editor-dialog/campaign-editor-dialog.component').then(
          (m) => m.CampaignEditorDialogComponent,
        ),
    };

    void this.dialogService.open(dialog, {});
  }
}
