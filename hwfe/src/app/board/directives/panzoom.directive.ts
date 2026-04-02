import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';

@Directive({
  selector: '[appPanzoom]',
})
export class PanzoomDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLElement>);

  private parentElement: HTMLElement | undefined = this.elementRef.nativeElement.parentElement;

  private panzoom!: PanzoomObject;

  ngOnInit() {
    const hostElement: HTMLElement = this.elementRef.nativeElement;

    this.panzoom = Panzoom(hostElement, {
      canvas: true,
      contain: 'outside',
      maxScale: 2,
      minScale: 0.5,
    });

    this.parentElement?.addEventListener('wheel', this.onWheel);
  }

  ngOnDestroy(): void {
    if (this.parentElement) {
      this.parentElement.removeEventListener('wheel', this.onWheel);
    }

    if (this.panzoom) {
      this.panzoom.destroy();
    }
  }

  private onWheelFn(event: WheelEvent): void {
    this.panzoom.zoomWithWheel(event);
  }

  private onWheel = this.onWheelFn.bind(this);
}
