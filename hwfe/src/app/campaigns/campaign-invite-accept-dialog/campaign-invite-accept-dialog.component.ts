import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, maxLength } from '@angular/forms/signals';
import { Klass } from '@hw/prismagen/enums';
import { HwMembershipAcceptDto } from '@hw/shared';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { MyCampaign } from '../types/my-campaign.type';

export type CampaignInviteAcceptDialogData = {
  campaign: MyCampaign;
};

export type CampaignInviteAcceptDialogResult = boolean;

@Component({
  selector: 'app-campaign-invite-accept-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    InputTextComponent,
    FormsModule,
    JsonPipe,
  ],
  templateUrl: './campaign-invite-accept-dialog.component.html',
  styleUrl: './campaign-invite-accept-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInviteAcceptDialogComponent {
  public data = inject<CampaignInviteAcceptDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignInviteAcceptDialogResult>>(DialogRef);
  private membershipsApiService = inject(MembershipsApiService);

  public klasses = Object.values(Klass);

  public model = signal<HwMembershipAcceptDto>({
    campaignId: this.data.campaign.id,
    klass: Klass.BARBARIAN,
    name: '',
  });

  public form = form(this.model, (schemaPath) => {
    maxLength(schemaPath.name, 12);
  });

  public selected(klass: Klass): boolean {
    return this.model().klass === klass;
  }

  public select(klass: Klass): void {
    this.model.update((value) => ({ ...value, klass: klass }));
  }

  public trackFn = (klass: Klass): string => {
    return klass;
  };
  public displayFn = (klass: Klass): string => {
    return klass;
  };

  public accept(): void {
    this.membershipsApiService.accept(this.model()).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
