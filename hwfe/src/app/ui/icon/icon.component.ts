import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconName, Icons } from './icon-registry';

@Component({
  selector: 'app-icon',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[innerHTML]': 'svgContent()',
    class: 'inline-block leading-none shrink-0',
  },
})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);

  public name = input.required<IconName>();
  public size = input<string>('w-5 h-5');
  public stroke = input<number>(1.5);

  public svgContent = computed(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           stroke-width="${this.stroke()}"
           stroke="currentColor"
           class="${this.size()}">
        ${Icons[this.name()]}
      </svg>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
