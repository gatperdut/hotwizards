import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared';
import {
  AdventurePickerAction,
  AdventurePickerComponent,
} from '../campaigns/campaign/town/adventure-picker/adventure-picker.component';
import { ButtonComponent } from '../ui/button/button.component';
import { DialogRef } from '../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../ui/dialog/services/dialog.service';

export type EditorSelectDialogData = void;

export type EditorSelectDialogResult = void;

@Component({
  selector: 'app-editor-select-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    AdventurePickerComponent,
  ],
  templateUrl: './editor-select-dialog.component.html',
  styleUrl: './editor-select-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSelectDialogComponent {
  public data = inject<EditorSelectDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<EditorSelectDialogResult>>(DialogRef);
  private router = inject(Router);

  public adventurePickerActions: AdventurePickerAction[] = [
    {
      label: 'Edit',
      action: (adventureTemplate: HwAdventureTemplate): void => {
        this.dialogRef.close();
        void this.router.navigate(['home', 'editor', adventureTemplate.id]);
      },
    },
  ];
}
