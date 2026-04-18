import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { DialogActionsDirective } from './dialog-actions.directive';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  public size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  public close = output();

  public ngOnInit(): void {
    document.body.classList.add('no-scroll');
  }

  public ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  private appDialogActions = contentChild(DialogActionsDirective);

  public hasActions = computed(() => !!this.appDialogActions());

  public sizeClass = computed(() => {
    const map = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
    };
    return map[this.size()];
  });
}
