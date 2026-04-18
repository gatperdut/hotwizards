import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-paginator',
  imports: [ButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  public page = model.required<number>();
  public pages = input.required<number>();
}
