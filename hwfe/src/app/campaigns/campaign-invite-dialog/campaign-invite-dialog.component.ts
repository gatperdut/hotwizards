import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { form } from '@angular/forms/signals';
import { HwUserExt } from '@hw/shared';
import { map, tap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogActionsDirective } from '../../ui/dialog/dialog-actions.directive';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent } from '../../ui/select/select.component';
import { UsersApiService } from '../../users/users-api.service';

export type CampaignInviteDialogData = {
  name: string;
};

export type CampaignInviteDialogResult = boolean;

export type TheUser = {
  label: string;
  value: string;
};

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

  public model = signal<HwUserExt[]>([]);

  public form = form(this.model);

  public trackFn = (user: HwUserExt): number => {
    return user.id;
  };

  public displayFn = (user: HwUserExt): string => {
    return user.handle;
  };

  public searchModel = signal<{ term: string }>({ term: '' });

  public a = toObservable(this.searchModel)
    .pipe(
      tap((a) => {
        console.log(a);
      }),
    )
    .subscribe();

  private resource = rxResource<HwUserExt[], string>({
    params: () => this.searchModel().term,
    stream: (request) =>
      this.usersApiService.search({ term: request.params }).pipe(map((response) => response.items)),
  });

  public options = computed(() => this.resource.value() || []);
}
