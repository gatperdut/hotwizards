import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { DialogRef } from '@hw/hwfe/app/ui/dialog/dialog-ref.class';
import { DialogComponent } from '@hw/hwfe/app/ui/dialog/dialog.component';
import { DialogActionsDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '@hw/hwfe/app/ui/dialog/services/dialog.service';
import { PushApiService } from '../services/push-api.service';

export type PushDialogData = void;

export type PushDialogResult = void;

@Component({
  selector: 'app-push-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    AsyncPipe,
  ],
  templateUrl: './push-dialog.component.html',
  styleUrl: './push-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushDialogComponent {
  public data = inject<PushDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<PushDialogResult>>(DialogRef);
  private pushApiService = inject(PushApiService);
  private swPush = inject(SwPush);

  public subscription$ = this.swPush.subscription;

  public subscribe(): void {
    this.pushApiService.upsert().subscribe();
  }

  public unsubscribe(): void {
    this.pushApiService.delete().subscribe();
  }
}
