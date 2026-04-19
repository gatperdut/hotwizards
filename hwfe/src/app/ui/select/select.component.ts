import { JsonPipe } from '@angular/common';
import { Component, ElementRef, HostListener, input, model, signal } from '@angular/core';
import { debounce, Field, form } from '@angular/forms/signals';
import { InputTextComponent } from '../input-text/input-text.component';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [InputTextComponent, TagComponent, JsonPipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  public label = input.required<string>();
  public placeholder = input<string>('Select...');
  public options = input.required<any[] | undefined>();
  public trackFn = input.required<(item: any) => string | number>();
  public displayFn = input.required<(item: any) => string>();
  public form = input.required<Field<any>>();
  public searchField = model.required<string>();
  public multiple = input<boolean>(false);
  public loading = input<boolean>(false);
  public searchable = input<boolean>(true);

  constructor(private eRef: ElementRef) {}

  public id = `app-select-${Math.random().toString(36).substring(2, 9)}`;
  public isOpen = signal(false);

  public searchForm = form(this.searchField, (schemaPath) => {
    debounce(schemaPath, 400);
  });

  public toggle(): void {
    if (this.form()().disabled()) {
      return;
    }

    this.searchField.set('');
    this.isOpen.update((open) => !open);
    this.form()().markAsTouched();
  }

  public select(option: any): void {
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
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
