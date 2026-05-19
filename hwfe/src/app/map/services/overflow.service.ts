import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable()
export class OverflowService {
  private document = inject(DOCUMENT);

  private htmlElement = this.document.documentElement;

  public unhide(): void {
    this.htmlElement.classList.remove('overflow-hidden');
    this.htmlElement.classList.add('scrollbar-gutter-stable');
  }

  public hide(): void {
    this.htmlElement.classList.add('overflow-hidden');
    this.htmlElement.classList.remove('scrollbar-gutter-stable');
  }
}
