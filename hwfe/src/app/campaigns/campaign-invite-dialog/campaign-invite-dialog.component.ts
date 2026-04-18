import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogActionsDirective } from '../../ui/dialog/dialog-actions.directive';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CampaignInviteDialogData = {
  name: string;
};

export type CampaignInviteDialogResult = boolean;

@Component({
  selector: 'app-campaign-invite-dialog',
  imports: [DialogComponent, DialogActionsDirective, ButtonComponent],
  templateUrl: './campaign-invite-dialog.component.html',
  styleUrl: './campaign-invite-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInviteDialogComponent {
  public data = inject<CampaignInviteDialogData>(APP_DIALOG_DATA);
  public ref = inject<DialogRef<CampaignInviteDialogResult>>(DialogRef);
}
