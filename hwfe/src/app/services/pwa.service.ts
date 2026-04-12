import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { filter, tap } from 'rxjs';
import { ToastService } from '../ui/toast/services/toast.service.js';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private toastService = inject(ToastService);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    setInterval((): void => {
      void this.swUpdate.checkForUpdate();
    }, 60 * 1000);

    this.swUpdate.versionUpdates
      .pipe(
        filter((event: VersionEvent): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        tap(() => {
          this.toastService.show({
            message: 'New version available',
            duration: 0,
            actions: [
              {
                label: 'Download',
                callback: (): void => {
                  void this.swUpdate.activateUpdate().then((): void => location.reload());
                },
              },
            ],
          });
        }),
      )
      .subscribe();
  }
}
