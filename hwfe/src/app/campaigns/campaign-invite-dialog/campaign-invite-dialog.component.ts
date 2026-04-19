import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form } from '@angular/forms/signals';
import { HwUserExt } from '@hw/shared';
import { map } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogActionsDirective } from '../../ui/dialog/dialog-actions.directive';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { UsersApiService } from '../../users/users-api.service';
import { MyCampaign } from '../types/my-campaign.type';

export type CampaignInviteDialogData = {
  campaign: MyCampaign;
};

export type CampaignInviteDialogResult = boolean;

@Component({
  selector: 'app-campaign-invite-dialog',
  imports: [DialogComponent, DialogActionsDirective, ButtonComponent, SelectComponent, JsonPipe],
  templateUrl: './campaign-invite-dialog.component.html',
  styleUrl: './campaign-invite-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInviteDialogComponent {
  public data = inject<CampaignInviteDialogData>(APP_DIALOG_DATA);
  public ref = inject<DialogRef<CampaignInviteDialogResult>>(DialogRef);
  private usersApiService = inject(UsersApiService);

  public usersModel = signal<HwUserExt[]>([]);
  public usersForm = form(this.usersModel);
  public searchModel = signal<string>('');
  public trackFn = (user: HwUserExt): number => {
    return user.id;
  };
  public displayFn = (user: HwUserExt): string => {
    return user.handle;
  };
  public resource = rxResource<HwUserExt[], string>({
    params: () => this.searchModel(),
    stream: (request) => {
      const forbiddenIds = [
        this.data.campaign.master.id,
        ...this.data.campaign.members.map((member) => member.id),
      ];
      return this.usersApiService
        .search({ term: request.params })
        .pipe(map((response) => response.items.filter((user) => !forbiddenIds.includes(user.id))));
    },
  });

  public options = computed(() => this.resource.value() || []);
}
