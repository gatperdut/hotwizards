import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, minLength } from '@angular/forms/signals';
import { HwUser } from '@hw/shared';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CampaignEditorDialogData = {};

export type CampaignInEditorDialogResult = boolean;

@Component({
  selector: 'app-campaign-editor-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
  ],
  templateUrl: './campaign-editor-dialog.component.html',
  styleUrl: './campaign-editor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignEditorDialogComponent {
  public data = inject<CampaignEditorDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CampaignInEditorDialogResult>>(DialogRef);

  public model = signal<HwUser[]>([]);
  public form = form(this.model, (schemaPath) => {
    minLength(schemaPath, 1);
  });

  public invite(): void {
    // TODO
  }
}
