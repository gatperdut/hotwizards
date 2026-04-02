import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { PwaSnackComponent } from '../pwa-snack/pwa-snack.component';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private matSnackBar = inject(MatSnackBar);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    setInterval((): void => {
      this.swUpdate.checkForUpdate();
    }, 60 * 1000);

    this.swUpdate.versionUpdates
      .pipe(
        filter((event: VersionEvent): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        switchMap((): Observable<void> => {
          return this.matSnackBar.openFromComponent(PwaSnackComponent).onAction();
        }),
        tap((): void => {
          this.swUpdate.activateUpdate().then((): void => location.reload());
        }),
      )
      .subscribe();
  }
}
