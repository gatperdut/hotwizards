import { Subject } from 'rxjs';

export class DialogRef<R = any> {
  public afterClosed$ = new Subject<R | undefined>();

  public close(result?: R): void {
    this.afterClosed$.next(result);
    this.afterClosed$.complete();
  }
}
