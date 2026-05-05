import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  PushDialogComponent,
  PushDialogData,
  PushDialogResult,
} from '@hw/hwfe/push/push-dialog/push-dialog.component';
import { AuthService } from '../../auth/services/auth.service';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { AppMenuItem, MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-user-menu',
  imports: [MenuComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);

  public items: AppMenuItem[] = [
    { label: 'Push notifications', icon: 'user', callback: () => this.pushNotifications() },
    {
      label: 'Logout',
      icon: 'arrow-left-start-on-rectangle',
      callback: () => this.authService.logout(),
      color: 'warning',
    },
  ];

  public pushNotifications(): void {
    const dialog: LazyDialog<PushDialogComponent, PushDialogData, PushDialogResult> = {
      importFn: () =>
        import('../../../push/push-dialog/push-dialog.component').then(
          (m) => m.PushDialogComponent,
        ),
    };
    void this.dialogService.open(dialog, null);
  }
}
