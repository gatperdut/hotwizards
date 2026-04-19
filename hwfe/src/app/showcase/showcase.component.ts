import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { disabled, form, required } from '@angular/forms/signals';
import { delay, map, of } from 'rxjs';
import { ButtonComponent } from '../ui/button/button.component';
import { CheckboxComponent } from '../ui/checkbox/checkbox.component';
import { InputTextComponent } from '../ui/input-text/input-text.component';
import { LinkComponent } from '../ui/link/link.component';
import { SelectComponent } from '../ui/select/select.component';
import { ToastService } from '../ui/toast/services/toast.service';

type SelectItem = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-showcase',
  imports: [ButtonComponent, InputTextComponent, LinkComponent, CheckboxComponent, SelectComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  private toastService = inject(ToastService);

  public form = form(
    signal({
      emptyEnabled: '',
      filledEnabled: 'With required validation',
      disabled: '',
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: true,
    }),
    (s) => {
      required(s.filledEnabled, { message: "See? It's required" });
      disabled(s.disabled, () => true);
      disabled(s.checkbox4, () => true);
    },
  );

  public toastInfinite(): void {
    this.toastService.show({ message: 'Stay until you click me', duration: 0 });
  }

  public toast4s(): void {
    this.toastService.show({ message: 'Be gone in 4 seconds' });
  }

  public toastWithActions(): void {
    this.toastService.show({
      message: 'Yes or no?',
      duration: 0,
      actions: [
        { label: 'Yes', color: 'primary', callback: (): void => {} },
        { label: 'No', color: 'warning', callback: (): void => {} },
        { label: 'Maybe', color: 'secondary', callback: (): void => {} },
      ],
    });
  }

  public toastSecondary(): void {
    this.toastService.show({ message: 'Secondary toast', color: 'secondary' });
  }

  public toastWarning(): void {
    this.toastService.show({ message: 'Warning toast', color: 'warning' });
  }

  public selectItems = [...Array(10)].map((_item, index) => {
    return {
      id: index,
      name: `Item ${index}`,
    };
  });

  public itemsModel1 = signal<SelectItem[]>([]);
  public itemsForm1 = form(this.itemsModel1);
  public searchModel1 = signal<string>('');
  public trackFn = (user: SelectItem): number => {
    return user.id;
  };
  public displayFn = (user: SelectItem): string => {
    return user.name;
  };
  public resource = rxResource<SelectItem[], string>({
    params: () => this.searchModel1(),
    stream: (request) => {
      return of(request).pipe(
        delay(1000),
        map(() => this.selectItems.filter((item) => item.name.includes(request.params))),
      );
    },
  });

  public options1 = computed(() => this.resource.value());

  public itemsModel2 = signal<SelectItem[]>([]);
  public itemsForm2 = form(this.itemsModel2);
  public searchModel2 = signal<string>('');
  public options2 = computed(() =>
    this.selectItems.filter((item) => item.name.toLocaleLowerCase().includes(this.searchModel2())),
  );

  public itemsModel3 = signal<SelectItem[]>([]);
  public itemsForm3 = form(this.itemsModel2, (schemaPath) => {
    disabled(schemaPath);
  });
  public searchModel3 = signal<string>('');
  public options3 = computed(() =>
    this.selectItems.filter((item) => item.name.toLocaleLowerCase().includes(this.searchModel2())),
  );
}
