import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { DialogActionsDirective } from './directives/dialog-actions.directive';
import { DialogContentDirective } from './directives/dialog-content.directive';
import { DialogTitleDirective } from './directives/dialog-title.directive';

@Component({
  selector: 'app-dialog',
  imports: [NgTemplateOutlet],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  public titleTemplate = contentChild(DialogTitleDirective, {
    read: TemplateRef,
    descendants: true,
  });
  public contentTemplate = contentChild(DialogContentDirective, {
    read: TemplateRef,
    descendants: true,
  });
  public actionsTemplate = contentChild(DialogActionsDirective, {
    read: TemplateRef,
    descendants: true,
  });

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

  public ngOnInit(): void {
    document.body.classList.add('no-scroll');
  }

  public ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  private appDialogActions = contentChild(DialogActionsDirective);

  public hasActions = computed(() => !!this.appDialogActions());
}
