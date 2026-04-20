import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, minLength } from '@angular/forms/signals';
import { HwUserExt } from '@hw/shared';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { MyCampaign } from '../types/my-campaign.type';

export type CampaignJoinDialogData = {
  campaign: MyCampaign;
};

export type CampaignJoinDialogResult = boolean;

@Component({
  selector: 'app-campaign-join-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
  ],
  templateUrl: './campaign-join-dialog.component.html',
  styleUrl: './campaign-join-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignJoinDialogComponent {
  public data = inject<CampaignJoinDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignJoinDialogResult>>(DialogRef);
  private membershipsApiService = inject(MembershipsApiService);

  public model = signal<HwUserExt[]>([]);
  public form = form(this.model, (schemaPath) => {
    minLength(schemaPath, 1);
  });
  public searchModel = signal<string>('');
  public trackFn = (user: HwUserExt): number => {
    return user.id;
  };
  public displayFn = (user: HwUserExt): string => {
    return user.handle;
  };

  public join(): void {}
}
