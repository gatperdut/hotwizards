import { Component, ElementRef, HostListener, inject, input } from '@angular/core';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';

export interface SidebarButtonAction {
  icon: string;
  callback: () => void;
}

@Component({
  selector: 'app-sidebar-button',
  imports: [ButtonComponent],
  templateUrl: './sidebar-button.component.html',
  styleUrl: './sidebar-button.component.css',
  providers: [],
})
export class SidebarButtonComponent {
  private readonly elementRef = inject(ElementRef);

  public icon = input.required<string>();
  public callback = input<() => void>();
  public actions = input<SidebarButtonAction[]>([]);

  public id = `app-sidebar-button-${Math.random().toString(36).substring(2, 9)}`;
  public expanded = false;

  public onTrigger(): void {
    const callback = this.callback();
    if (callback) {
      callback();
    } else {
      this.expanded = !this.expanded;
    }
  }

  public onAction(action: SidebarButtonAction): void {
    action.callback();
    this.expanded = false;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.expanded = false;
    }
  }
}
