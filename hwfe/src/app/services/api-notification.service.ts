import { inject, Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, tap } from 'rxjs';
import { ToastService } from '../ui/toast/services/toast.service';

@Injectable({ providedIn: 'root' })
export class ApiNotificationService {
  private toastService = inject(ToastService);

  public notify<T>(messageOk: string, messageBad: string): MonoTypeOperatorFunction<T> {
    return tap({
      next: () => {
        this.toastService.show({
          message: messageOk,
          color: 'primary',
        });
      },
      error: () => {
        this.toastService.show({
          message: messageBad,
          color: 'warning',
        });
      },
    });
  }
}
