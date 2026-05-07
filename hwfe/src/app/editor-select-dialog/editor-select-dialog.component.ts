import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../ui/button/button.component';
import { DialogRef } from '../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../ui/dialog/services/dialog.service';

export type EditorSelectDialogData = void;

export type EditorSelectDialogResult = number;

@Component({
  selector: 'app-editor-select-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
  ],
  templateUrl: './editor-select-dialog.component.html',
  styleUrl: './editor-select-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSelectDialogComponent {
  public data = inject<EditorSelectDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<EditorSelectDialogResult>>(DialogRef);
}
