import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, minLength } from '@angular/forms/signals';
import { HwUser } from '@hw/shared';
import { map } from 'rxjs';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { UsersApiService } from '../../users/users-api.service';
import { HwfeCampaign } from '../types/my-campaign.type';

export type CampaignInviteDialogData = {
  campaign: HwfeCampaign;
};

export type CampaignInviteDialogResult = boolean;

@Component({
  selector: 'app-campaign-invite-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    SelectComponent,
  ],
  templateUrl: './campaign-invite-dialog.component.html',
  styleUrl: './campaign-invite-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInviteDialogComponent {
  public data = inject<CampaignInviteDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignInviteDialogResult>>(DialogRef);
  private usersApiService = inject(UsersApiService);
  private membershipsApiService = inject(MembershipsApiService);

  public model = signal<HwUser[]>([]);
  public form = form(this.model, (schemaPath) => {
    minLength(schemaPath, 1);
  });
  public searchModel = signal<string>('');
  public trackFn = (user: HwUser): number => {
    return user.id;
  };
  public displayFn = (user: HwUser): string => {
    return user.handle;
  };
  public resource = rxResource<HwUser[], string>({
    params: () => this.searchModel(),
    stream: (request) => {
      const forbiddenIds = [
        this.data.campaign.master.id,
        ...this.data.campaign.memberships.map((membership) => membership.id),
      ];
      return this.usersApiService
        .search({ term: request.params })
        .pipe(map((response) => response.items.filter((user) => !forbiddenIds.includes(user.id))));
    },
  });

  public options = computed(() => this.resource.value() || []);

  public invite(): void {
    this.membershipsApiService
      .invite({ campaignId: this.data.campaign.id, userIds: this.model().map((user) => user.id) })
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }
}
