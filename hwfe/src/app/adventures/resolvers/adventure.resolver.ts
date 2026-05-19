import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { EMPTY, Observable } from 'rxjs';
import { ToastService } from '../../ui/toast/services/toast.service.js';

export const adventureResolver: ResolveFn<HwAdventureTemplate> = (
  route: ActivatedRouteSnapshot,
) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  const raw = route.paramMap.get('adventureId');

  const notFound = (): Observable<never> => {
    toastService.show({ message: 'Adventure not found', color: 'warning' });
    void router.navigate(['home', 'campaigns']);
    return EMPTY;
  };

  if (!raw) {
    return notFound();
  }

  const adventureId = Number(raw);

  if (adventureId <= 0 || !Number.isInteger(adventureId)) {
    return notFound();
  }

  // TODO proper call
  return notFound();
  // return inject(AdventuresApiService)
  //   .get(adventureId)
  //   .pipe(catchError(() => notFound()));
};
