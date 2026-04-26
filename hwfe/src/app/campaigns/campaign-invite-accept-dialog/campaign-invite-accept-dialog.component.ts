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
import { GendersService } from '../../characters/services/genders.service';
import { KlassesService } from '../../characters/services/klasses.service';
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

export type CampaignInviteAcceptDialogData = {
  membershipId: number;
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
  ],
  templateUrl: './campaign-invite-accept-dialog.component.html',
  styleUrl: './campaign-invite-accept-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignInviteAcceptDialogComponent {
  public data = inject<CampaignInviteAcceptDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignInviteAcceptDialogResult>>(DialogRef);
  private membershipsApiService = inject(MembershipsApiService);
  public klassesService = inject(KlassesService);
  private gendersService = inject(GendersService);

  public model = signal<HwMembershipAcceptDto>({
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
      BARBARIAN: this.klassesService.portrait('BARBARIAN', gender),
      DWARF: this.klassesService.portrait('DWARF', gender),
      ELF: this.klassesService.portrait('ELF', gender),
      WIZARD: this.klassesService.portrait('WIZARD', gender),
    };
  });

  public selected(klass: Klass): boolean {
    return this.model().klass === klass;
  }

  public select(klass: Klass): void {
    this.model.update((value) => ({ ...value, klass: klass }));
  }

  public genderDisplayFn = (gender: Gender): string => this.gendersService.name(gender);

  public accept(): void {
    this.membershipsApiService.accept(this.data.membershipId, this.model()).subscribe({
      next: () => {
        this.dialogRef.close();
      },
    });
  }
}
