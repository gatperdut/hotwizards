import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared';
import { catchError, EMPTY, Observable } from 'rxjs';
import { ToastService } from '../../ui/toast/services/toast.service.js';
import { AdventureTemplatesApiService } from '../services/adventure-templates-api.service.js';

export const adventureTemplateResolver: ResolveFn<HwAdventureTemplate> = (
  route: ActivatedRouteSnapshot,
) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  const raw = route.paramMap.get('adventureTemplateId');

  const notFound = (): Observable<never> => {
    toastService.show({ message: 'Adventure template not found', color: 'warning' });
    void router.navigate(['home', 'campaigns']);
    return EMPTY;
  };

  if (!raw) {
    return notFound();
  }

  const adventureTemplateId = Number(raw);

  if (adventureTemplateId <= 0 || !Number.isInteger(adventureTemplateId)) {
    return notFound();
  }

  return inject(AdventureTemplatesApiService)
    .get(adventureTemplateId)
    .pipe(catchError(() => notFound()));
};
