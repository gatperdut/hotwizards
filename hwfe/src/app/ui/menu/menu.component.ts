import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export interface AppMenuItem {
  label: string;
  callback?: () => void;
  icon?: string;
  disabled?: boolean;
  separator?: boolean; // TODO
  color?: 'primary' | 'secondary' | 'warning';
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private readonly elRef = inject(ElementRef);

  public label = input<string>();
  public icon = input<string>();
  public items = input.required<AppMenuItem[]>();
  public disabled = input<boolean>(false);

  public id = `app-menu-${Math.random().toString(36).substring(2, 9)}`;

  public open = signal(false);

  public toggle(): void {
    this.open.update((v) => !v);
  }

  public handleClick(item: AppMenuItem): void {
    if (item.disabled || item.separator) {
      return;
    }

    item.callback?.();
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  public publiconEscape(): void {
    this.open.set(false);
  }
}
