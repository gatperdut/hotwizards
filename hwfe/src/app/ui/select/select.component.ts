import { JsonPipe } from '@angular/common';
import { Component, ElementRef, HostListener, input, model, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
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
  public field = input.required<Field<any>>();
  public searchField = model.required<{ term: string }>();
  public multiple = input<boolean>(false);
  public loading = input<boolean>(false);
  public searchable = input<boolean>(true); // = equivalent to presence of searchField
  public search = output<string>();

  constructor(private eRef: ElementRef) {}

  public id = `app-select-${Math.random().toString(36).substring(2, 9)}`;
  public isOpen = signal(false);

  public form = form(this.searchField);

  public toggle(): void {
    if (this.field()().disabled()) {
      return;
    }

    this.searchField.set({ term: '' });

    this.isOpen.update((v) => !v);

    this.field()().markAsTouched();
  }

  public select(option: any): void {
    if (this.multiple()) {
      const currentValue: any[] = this.field()().value();

      const index = currentValue.findIndex(
        (someOption) => this.trackFn()(option) === this.trackFn()(someOption),
      );
      if (index >= 0) {
        currentValue.splice(index, 1);
      } else {
        currentValue.push(option);
      }

      this.field()().value.set([...currentValue]);
    } else {
      this.field()().value.set(option);
      this.isOpen.set(false);
      this.field()().markAsTouched();
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
