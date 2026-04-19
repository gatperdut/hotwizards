import { Component, computed, ElementRef, HostListener, input, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { InputTextComponent } from '../input-text/input-text.component';
import { TagComponent } from '../tag/tag.component';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [InputTextComponent, TagComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  public label = input.required<string>();
  public placeholder = input<string>('Select...');
  public options = input<SelectOption[]>([]);
  public field = input.required<Field<any>>();
  public multiple = input<boolean>(false);
  public loading = input<boolean>(false);
  public searchable = input<boolean>(true);

  constructor(private eRef: ElementRef) {}

  public id = `app-select-${Math.random().toString(36).substring(2, 9)}`;
  public isOpen = signal(false);
  private model = signal({
    term: '',
  });
  public form = form(this.model);

  public filteredOptions = computed(() => {
    const term = this.model().term;
    const opts = this.options();

    if (!term) {
      return opts;
    }
    return opts.filter((o) => o.label.toLowerCase().includes(term));
  });

  public currentValue = computed(() => this.field()().value());

  public displayText = computed(() => {
    const val = this.currentValue();
    const opts = this.options();

    if (this.multiple()) {
      return (
        opts
          .filter((o) => val.includes(o.value))
          .map((o) => o.label)
          .join(', ') || this.placeholder()
      );
    }

    return opts.find((o) => o.value === val)?.label || this.placeholder();
  });

  public toggle(): void {
    if (this.field()().disabled()) {
      return;
    }

    this.isOpen.update((v) => !v);

    if (this.isOpen()) {
      this.model.update((value) => ({ ...value, term: '' }));
    } else {
      this.field()().markAsTouched();
    }
  }

  public select(option: SelectOption): void {
    if (this.multiple()) {
      const currentValue = this.currentValue();

      const index = currentValue.indexOf(option.value);
      if (index >= 0) {
        currentValue.splice(index, 1);
      } else {
        currentValue.push(option.value);
      }

      this.field()().value.set([...currentValue]);
    } else {
      this.field()().value.set(option.value);
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
