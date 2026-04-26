import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PresenceService } from '@hw/hwfe/sockets/services/presence.service';

@Component({
  selector: 'app-online-mark',
  imports: [],
  template: '',
  host: {
    class: 'w-3.5 h-3.5 inline-block rounded-full mb-hw-xxsmall',
    '[class.bg-primary]': 'online()',
    '[class.bg-off-medium]': '!online()',
  },
  styleUrl: './online-mark.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineMarkComponent {
  private presenceService = inject(PresenceService);

  public userId = input.required<number>();

  public online = computed(() => this.presenceService.online().has(this.userId()));
}
