import { EventEmitter } from 'pixi.js';
import { Observable } from 'rxjs';

export const fromPixiEvent = <T>(target: EventEmitter, event: string): Observable<T> => {
  return new Observable<T>((observer) => {
    const handler = (value: T): void => observer.next(value);
    target.on(event, handler);
    return () => target.off(event, handler);
  });
};
