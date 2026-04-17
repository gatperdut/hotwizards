import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { UsersApiService } from '../users/users-api.service';
import { CampaignsApiService } from './services/campaigns-api.service';

export type CampaignSearchDto = {
  name: string;
};

@Component({
  selector: 'app-campaigns',
  imports: [JsonPipe],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsComponent {
  private campaignsApiService = inject(CampaignsApiService);
  private usersApiService = inject(UsersApiService);
  private authService = inject(AuthService);

  private model = signal<CampaignSearchDto>({
    name: '',
  });

  private campaignsResource = rxResource({
    params: () => this.model(),
    stream: (request) =>
      this.campaignsApiService.mine().pipe(
        switchMap((campaigns) => {
          const userIds = [
            ...new Set(campaigns.flatMap((campaign) => [campaign.masterId, ...campaign.memberIds])),
          ];

          return this.usersApiService.get(userIds).pipe(
            map((usersExt) => {
              const userId = this.authService.userId();

              const userMap = Object.fromEntries(
                usersExt.map((userExt) => {
                  return userExt.id === userId
                    ? [userId, this.authService.user()]
                    : [userExt.id, userExt];
                }),
              );

              return campaigns.map((campaign) => ({
                id: campaign.id,
                name: campaign.id,
                createdAt: campaign.createdAt,
                master: userMap[campaign.masterId],
                members: campaign.memberIds.map((memberId) => userMap[memberId]),
              }));
            }),
          );
        }),
      ),
  });

  public campaigns = computed(() => this.campaignsResource.value() ?? []);
}
