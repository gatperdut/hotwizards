import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from './services/icon.service';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'safeSvg()',
    '[class]': 'classes() + " shrink-0 fill-current"',
  },
})
export class IconComponent {
  private iconService = inject(IconService);
  private sanitizer = inject(DomSanitizer);

  public name = input.required<string>();
  public classes = input<string>('w-4 h-4');

  constructor() {
    effect(() => {
      const iconName = this.name();
      this.iconService.getIcon(iconName).subscribe({
        next: (svg) => this.rawSvg.set(svg),
        error: () => {
          console.error(`Icon "${iconName}" not found.`);
          this.rawSvg.set('');
        },
      });
    });
  }

  private rawSvg = signal<string>('');

  protected safeSvg = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.rawSvg()),
  );
}
