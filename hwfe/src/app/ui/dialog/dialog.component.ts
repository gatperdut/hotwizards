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
  public sizeClass = input<
    | 'max-w-sm'
    | 'max-w-md'
    | 'max-w-lg'
    | 'max-w-xl'
    | 'max-w-2xl'
    | 'max-w-3xl'
    | 'max-w-4xl'
    | 'max-w-5xl'
  >('max-w-md');
  public close = output();

  public ngOnInit(): void {
    document.body.classList.add('no-scroll');
  }

  public ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  private appDialogActions = contentChild(DialogActionsDirective);

  public hasActions = computed(() => !!this.appDialogActions());
}
