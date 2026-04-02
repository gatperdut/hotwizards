import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-pwa-snack',
  imports: [MatButton, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './pwa-snack.component.html',
  styleUrl: './pwa-snack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaSnackComponent {
  public snackBarRef = inject(MatSnackBarRef);
}
