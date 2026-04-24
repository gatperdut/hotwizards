import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  Type,
} from '@angular/core';
import { DialogRef } from '../dialog-ref.class';

export const APP_DIALOG_DATA = new InjectionToken<any>('APP_DIALOG_DATA');

export interface LazyDialog<C, D, R> {
  importFn: () => Promise<Type<C>>;
  data?: D;
  result?: R;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);

  public async open<C, D, R>(lazy: LazyDialog<C, D, R>, data: D): Promise<DialogRef<R>> {
    const component = await lazy.importFn();
    return this.openInternal(component, data);
  }

  private openInternal<T, D = any, R = any>(component: Type<T>, data: D): DialogRef<R> {
    const dialogRef = new DialogRef<R>();

    const componentRef = createComponent(component, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({
        providers: [
          { provide: APP_DIALOG_DATA, useValue: data },
          { provide: DialogRef, useValue: dialogRef },
        ],
        parent: this.injector,
      }),
    });

    document.body.appendChild(componentRef.location.nativeElement);

    this.appRef.attachView(componentRef.hostView);

    dialogRef.afterClosed$.subscribe(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    return dialogRef;
  }
}
