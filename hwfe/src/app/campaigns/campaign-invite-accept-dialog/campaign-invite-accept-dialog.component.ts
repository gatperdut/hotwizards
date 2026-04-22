import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, maxLength, required } from '@angular/forms/signals';
import { Gender, Klass } from '@hw/prismagen/browser';
import { HwMembershipAcceptDto } from '@hw/shared';
import { GenderService } from '../../characters/services/gender.service';
import { KlassService } from '../../characters/services/klass.service';
import { MembershipsApiService } from '../../memberships/memberships-api.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { InputTextComponent } from '../../ui/input-text/input-text.component';
import { SelectComponent } from '../../ui/select/select.component';
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
    SelectComponent,
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
  public klassService = inject(KlassService);
  private genderService = inject(GenderService);

  public model = signal<HwMembershipAcceptDto>({
    campaignId: this.data.campaign.id,
    klass: Klass.BARBARIAN,
    gender: Gender.MALE,
    name: '',
  });

  public form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
    maxLength(schemaPath.name, 12);
  });

  public klasses = Object.values(Klass);

  public genders = Object.values(Gender);

  public portraits: Signal<Record<Klass, string>> = computed(() => {
    const gender = this.model().gender;

    return {
      BARBARIAN: this.klassService.portrait('BARBARIAN', gender),
      DWARF: this.klassService.portrait('DWARF', gender),
      ELF: this.klassService.portrait('ELF', gender),
      WIZARD: this.klassService.portrait('WIZARD', gender),
    };
  });

  public selected(klass: Klass): boolean {
    return this.model().klass === klass;
  }

  public select(klass: Klass): void {
    this.model.update((value) => ({ ...value, klass: klass }));
  }

  public genderDisplayFn = (gender: Gender): string => this.genderService.name(gender);

  public accept(): void {
    this.membershipsApiService.accept(this.model()).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
