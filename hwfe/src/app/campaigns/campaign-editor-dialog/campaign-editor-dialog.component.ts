import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, minLength } from '@angular/forms/signals';
import { HwCampaignEditDto } from '@hw/shared';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CampaignEditorDialogData = HwCampaignEditDto;

export type CampaignEditorDialogResult = boolean;

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
  public dialogRef = inject<DialogRef<CampaignEditorDialogResult>>(DialogRef);

  public creating = !this.data.id;

  public model = signal<HwCampaignEditDto>({
    id: this.data.id,
    name: this.data.name,
    aoo: this.data.aoo,
    movement: this.data.movement,
  });
  public form = form(this.model, (schemaPath) => {
    minLength(schemaPath.name, 1);
  });

  public create(): void {
    // TODO
  }
}
