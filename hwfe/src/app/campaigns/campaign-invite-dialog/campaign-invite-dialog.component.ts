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
    { label: 'Architect 5', value: 'arch 5' },
    { label: 'Engineer 5', value: 'eng 5' },
    { label: 'Designer 5', value: 'des 5' },
    { label: 'Stellar Navigator 5', value: 'nav 5' },
    { label: 'Architect 6', value: 'arch 6' },
    { label: 'Engineer 6', value: 'eng 6' },
    { label: 'Designer 6', value: 'des 6' },
    { label: 'Stellar Navigator 6', value: 'nav 6' },
    { label: 'Architect 7', value: 'arch 7' },
    { label: 'Engineer 7', value: 'eng 7' },
    { label: 'Designer 7', value: 'des 7' },
    { label: 'Stellar Navigator 7', value: 'nav 7' },
    { label: 'Architect 8', value: 'arch 8' },
    { label: 'Engineer 8', value: 'eng 8' },
    { label: 'Designer 8', value: 'des 8' },
    { label: 'Stellar Navigator 8', value: 'nav 8' },
    { label: 'Architect 9', value: 'arch 9' },
    { label: 'Engineer 9', value: 'eng 9' },
    { label: 'Designer 9', value: 'des 9' },
    { label: 'Stellar Navigator 9', value: 'nav 9' },
    { label: 'Architect 10', value: 'arch 10' },
    { label: 'Engineer 10', value: 'eng 10' },
    { label: 'Designer 10', value: 'des 10' },
    { label: 'Stellar Navigator 10', value: 'nav 10' },
    { label: 'Architect 11', value: 'arch 11' },
    { label: 'Engineer 11', value: 'eng 11' },
    { label: 'Designer 11', value: 'des 11' },
    { label: 'Stellar Navigator 11', value: 'nav 11' },
  ];

  techOptions: SelectOption[] = [
    { label: 'Angular', value: 'ng' },
    { label: 'Tailwind', value: 'tw' },
    { label: 'Signals', value: 'sig' },
    { label: 'Rust', value: 'rs' },
  ];
}
