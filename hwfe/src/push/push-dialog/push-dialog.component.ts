import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { DialogRef } from '@hw/hwfe/app/ui/dialog/dialog-ref.class';
import { DialogComponent } from '@hw/hwfe/app/ui/dialog/dialog.component';
import { DialogActionsDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '@hw/hwfe/app/ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '@hw/hwfe/app/ui/dialog/services/dialog.service';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
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
  private toastService = inject(ToastService);

  public subscription$ = this.swPush.subscription;

  public loading = signal(false);

  public subscribe(): void {
    this.loading.set(true);
    this.pushApiService
      .upsert()
      .subscribe({
        next: () => {
          this.toastService.show({ message: 'Push notifications enabled' });
        },
        error: () => {
          this.toastService.show({
            message: 'Push notifications could not be enabled',
            color: 'warning',
          });
        },
      })
      .add(() => {
        this.loading.set(false);
      });
  }

  public unsubscribe(): void {
    this.loading.set(true);
    this.pushApiService
      .delete()
      .subscribe({
        next: () => {
          this.toastService.show({ message: 'Push notifications disabled' });
        },
        error: () => {
          this.toastService.show({
            message: 'Push notifications could not be disabled',
            color: 'warning',
          });
        },
      })
      .add(() => {
        this.loading.set(false);
      });
  }
}
