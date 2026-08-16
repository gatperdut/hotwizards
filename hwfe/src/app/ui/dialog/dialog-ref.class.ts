import { Subject } from 'rxjs';

export class DialogRef<R = any> {
  public afterClosed$ = new Subject<R | undefined>();
  private closed = false;

  public close(result?: R): void {
    if (this.closed) {
      return;
    }
    this.closed = true;

    this.afterClosed$.next(result);
    this.afterClosed$.complete();
  }
}
