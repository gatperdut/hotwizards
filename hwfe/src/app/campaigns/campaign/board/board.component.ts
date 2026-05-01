import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PanzoomDirective } from './directives/panzoom.directive';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-board',
  imports: [PanzoomDirective, SidebarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  public tiles: number[] = Array.from({ length: 375 }, (_, i) => i);
}
