import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [ButtonComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);
}
