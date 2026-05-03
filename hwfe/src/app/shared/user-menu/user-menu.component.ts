import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  PushDialogComponent,
  PushDialogData,
  PushDialogResult,
} from '@hw/hwfe/push/push-dialog/push-dialog.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';

@Component({
  selector: 'app-user-menu',
  imports: [ButtonComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  private dialogService = inject(DialogService);

  public open(): void {
    const dialog: LazyDialog<PushDialogComponent, PushDialogData, PushDialogResult> = {
      importFn: () =>
        import('../../../push/push-dialog/push-dialog.component').then(
          (m) => m.PushDialogComponent,
        ),
    };
    void this.dialogService.open(dialog, null);
  }
}
