import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Wizard } from '@hw/shared';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PanzoomDirective } from './directives/panzoom.directive';

@Component({
  selector: 'app-board',
  imports: [PanzoomDirective, SidebarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private httpClient = inject(HttpClient);

  public tiles: number[] = Array.from({ length: 375 }, (_, i) => i);

  private user: Wizard | undefined;

  constructor() {
    this.httpClient.get<string>('/api/hello').subscribe((a) => {
      console.log('message is', a);
    });
  }
}
