import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogActionsDirective } from '../../ui/dialog/dialog-actions.directive';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';
import { SelectComponent, SelectOption } from '../../ui/select/select.component';

export type CampaignInviteDialogData = {
  name: string;
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

  public model = signal<{ roleField: string; techStackField: string }>({
    roleField: '',
    techStackField: '',
  });

  public form = form(this.model, (schemaPath) => {
    required(schemaPath.roleField, { message: 'An identifier is required' });

    required(schemaPath.techStackField, { message: 'Password is required' });
  });

  /**
   * 2. Define your Options
   * These can be static or come from an API.
   */
  roleOptions: SelectOption[] = [
    { label: 'Architect', value: 'arch' },
    { label: 'Engineer', value: 'eng' },
    { label: 'Designer', value: 'des' },
    { label: 'Stellar Navigator', value: 'nav' },
    { label: 'Architect 2', value: 'arch 2' },
    { label: 'Engineer 2', value: 'eng 2' },
    { label: 'Designer 2', value: 'des 2' },
    { label: 'Stellar Navigator 2', value: 'nav 2' },
    { label: 'Architect 3', value: 'arch 3' },
    { label: 'Engineer 3', value: 'eng 3' },
    { label: 'Designer 3', value: 'des 3' },
    { label: 'Stellar Navigator 3', value: 'nav 3' },
    { label: 'Architect 4', value: 'arch 4' },
    { label: 'Engineer 4', value: 'eng 4' },
    { label: 'Designer 4', value: 'des 4' },
    { label: 'Stellar Navigator 4', value: 'nav 4' },
  ];

  techOptions: SelectOption[] = [
    { label: 'Angular', value: 'ng' },
    { label: 'Tailwind', value: 'tw' },
    { label: 'Signals', value: 'sig' },
    { label: 'Rust', value: 'rs' },
  ];
}
