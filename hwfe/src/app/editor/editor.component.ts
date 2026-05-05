import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OverflowService } from '../shared/overflow.service';
import { PanzoomDirective } from '../shared/panzoom.directive';

@Component({
  selector: 'app-editor',
  imports: [PanzoomDirective],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverflowService],
})
export class EditorComponent implements OnInit, OnDestroy {
  private overflowService = inject(OverflowService);

  public ngOnInit(): void {
    this.overflowService.hide();
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
  }
}
