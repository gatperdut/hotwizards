import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PwaSnackComponent } from '../pwa/pwa-snack/pwa-snack.component';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private matSnackBar = inject(MatSnackBar);

  public snack(): void {
    this.matSnackBar.openFromComponent(PwaSnackComponent);
  }

  public error(): void {
    throw new Error('Another another error on purpose');
  }
}
