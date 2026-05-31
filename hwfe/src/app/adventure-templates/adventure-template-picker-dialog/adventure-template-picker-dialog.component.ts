import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { filter, from, switchMap, tap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import {
  APP_DIALOG_DATA,
  DialogService,
  LazyDialog,
} from '../../ui/dialog/services/dialog.service';
import {
  AdventurePickerAction,
  AdventureTemplatePickerComponent,
} from '../adventure-template-picker/adventure-template-picker.component';
import {
  SaveAdventureTemplateDialogComponent,
  SaveAdventureTemplateDialogData,
  SaveAdventureTemplateDialogResult,
} from '../save-adventure-template-dialog/save-adventure-template-dialog.component';

export type EditorSelectDialogData = void;

export type EditorSelectDialogResult = void;

@Component({
  selector: 'app-adventure-template-picker-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    AdventureTemplatePickerComponent,
  ],
  templateUrl: './adventure-template-picker-dialog.component.html',
  styleUrl: './adventure-template-picker-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventureTemplatePickerDialogComponent {
  public data = inject<EditorSelectDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<EditorSelectDialogResult>>(DialogRef);
  private router = inject(Router);
  private dialogService = inject(DialogService);

  public adventurePickerActions: AdventurePickerAction[] = [
    {
      label: 'Delete',
      color: 'warning',
      action: (adventureTemplate: HwAdventureTemplate): void => {
        // TODO implement adventure template delete
      },
    },
    {
      label: 'Edit',
      action: (adventureTemplate: HwAdventureTemplate): void => {
        this.dialogRef.close();
        void this.router.navigate(['home', 'editor', adventureTemplate.id]);
      },
    },
  ];

  public create(): void {
    this.dialogRef.close();

    const dialog: LazyDialog<
      SaveAdventureTemplateDialogComponent,
      SaveAdventureTemplateDialogData,
      SaveAdventureTemplateDialogResult
    > = {
      importFn: () =>
        import('../save-adventure-template-dialog/save-adventure-template-dialog.component').then(
          (m) => m.SaveAdventureTemplateDialogComponent,
        ),
    };
    from(
      this.dialogService.open(dialog, {
        dto: { name: '', info: '', dungeon: { cells: [] } },
      }),
    )
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed$),
        filter((adventureTemplate) => !!adventureTemplate),
        tap((adventureTemplate): void => {
          void this.router.navigate(['home', 'editor', adventureTemplate.id]);
        }),
      )
      .subscribe();
  }
}
