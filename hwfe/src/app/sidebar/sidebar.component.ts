import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@hw/prismagen';
import { PwaSnackComponent } from '../pwa/pwa-snack/pwa-snack.component.js';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private matSnackBar = inject(MatSnackBar);
  private httpClient = inject(HttpClient);

  public snack(): void {
    this.matSnackBar.openFromComponent(PwaSnackComponent);
  }

  public errorFE(): void {
    throw new Error('Yet another another error on purpose');
  }

  public errorBE(): void {
    this.httpClient.get<string>('/api/error').subscribe((a) => {
      console.log('message is', a);
    });
  }

  public user(): void {
    this.httpClient.get<User>('/api/user').subscribe((a: User) => {
      console.log('user is', a);
    });
  }
}
