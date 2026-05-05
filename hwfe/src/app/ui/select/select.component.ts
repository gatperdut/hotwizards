import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  model,
  ModelSignal,
  signal,
} from '@angular/core';
import { debounce, Field, form } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [InputTextComponent, TagComponent, IconComponent, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  public label = input<string>();
  public placeholder = input<string>('Make your selection');
  public options = input.required<any[] | undefined>();
  public trackFn = input<(item: any) => string | number>((item) => item);
  public displayFn = input<(item: any) => string>((item) => item);
  public form = input.required<Field<any>>();
  public searchField = model('');
  public multiple = input<boolean>(false);
  public loading = input<boolean>(false);
  public searchable = input(false);

  constructor(private elementRef: ElementRef) {}

  public id = `app-select-${Math.random().toString(36).substring(2, 9)}`;
  public isOpen = signal(false);

  public searchForm = form(this.searchField as ModelSignal<string>, (schemaPath) => {
    debounce(schemaPath, 400);
  });

  public open(): void {
    if (this.form()().disabled()) {
      return;
    }

    this.searchField.set('');
    this.isOpen.update((open) => !open);
    this.form()().markAsTouched();
  }

  public toggle(option: any): void {
    if (this.multiple()) {
      const currentValue: any[] = this.form()().value();

      const index = currentValue.findIndex(
        (someOption) => this.trackFn()(option) === this.trackFn()(someOption),
      );
      if (index >= 0) {
        currentValue.splice(index, 1);
      } else {
        currentValue.push(option);
      }

      this.form()().value.set([...currentValue]);
    } else {
      this.form()().value.set(option);
      this.isOpen.set(false);
      this.form()().markAsTouched();
    }
  }

  public isSelected(option: any): boolean {
    if (this.multiple()) {
      const current: any[] = this.form()().value();

      const id = this.trackFn()(option);
      return current.some((someOption) => this.trackFn()(someOption) === id);
    } else {
      return this.form() && this.trackFn()(this.form()) === this.trackFn()(option);
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
