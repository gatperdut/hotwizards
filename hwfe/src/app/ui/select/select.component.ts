import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, input, signal } from '@angular/core';
import { Field } from '@angular/forms/signals';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  label = input.required<string>();
  placeholder = input<string>('Select...');
  options = input<SelectOption[]>([]); // These come from your API via the parent
  field = input.required<Field<any>>();
  multiple = input<boolean>(false);
  loading = input<boolean>(false);
  searchable = input<boolean>(true); // New input to toggle search

  isOpen = signal(false);
  searchTerm = signal('');

  constructor(private eRef: ElementRef) {}

  // Filter options based on search term
  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const opts = this.options();
    if (!term) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(term));
  });

  currentValue = computed(() => this.field()().value());

  displayText = computed(() => {
    const val = this.currentValue();
    const opts = this.options();
    if (this.multiple() && Array.isArray(val)) {
      return (
        opts
          .filter((o) => val.includes(o.value))
          .map((o) => o.label)
          .join(', ') || this.placeholder()
      );
    }
    return opts.find((o) => o.value === val)?.label || this.placeholder();
  });

  toggle() {
    if (this.field()().disabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.searchTerm.set(''); // Reset search when opening
    } else {
      this.field()().markAsTouched();
    }
  }

  select(option: SelectOption) {
    if (this.multiple()) {
      const current = Array.isArray(this.currentValue()) ? [...this.currentValue()] : [];
      const index = current.indexOf(option.value);
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(option.value);
      }
      this.field()().value.set(current);
    } else {
      this.field()().value.set(option.value);
      this.isOpen.set(false);
      this.field()().markAsTouched();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
