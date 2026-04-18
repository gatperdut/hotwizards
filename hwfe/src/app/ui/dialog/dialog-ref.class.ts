import { Subject } from 'rxjs';

export class DialogRef<R = any> {
  private _afterClosed = new Subject<R | undefined>();
  public afterClosed$ = this._afterClosed.asObservable();

  public close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }
}
