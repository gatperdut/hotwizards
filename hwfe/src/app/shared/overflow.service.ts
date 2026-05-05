import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable()
export class OverflowService {
  private document = inject(DOCUMENT);

  public unhide(): void {
    this.document.documentElement.classList.remove('overflow-hidden');
    this.document.documentElement.classList.add('scrollbar-gutter-stable');
  }

  public hide(): void {
    this.document.documentElement.classList.add('overflow-hidden');
    this.document.documentElement.classList.remove('scrollbar-gutter-stable');
  }
}
