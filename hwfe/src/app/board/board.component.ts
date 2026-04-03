import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { User } from '@hw/shared/users/user.interface';
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

  public user: User | undefined;

  constructor() {
    this.httpClient.get<string>('localhost:3000/api/hello').subscribe((a) => {
      console.log(a);
    });
  }
}
