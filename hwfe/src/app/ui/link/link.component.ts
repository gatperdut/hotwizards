import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  public label = input.required<string>();

  public type = input<'primary' | 'secondary'>('primary');

  public to = input.required<string | string[] | UrlTree | undefined>();
}
