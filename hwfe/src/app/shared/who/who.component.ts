import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HwCharacter, HwUser } from '@hw/shared';
import { KlassesService } from '../../characters/services/klasses.service';
import { OnlineMarkComponent } from '../../users/online-mark/online-mark.component';

@Component({
  selector: 'app-who',
  imports: [OnlineMarkComponent],
  templateUrl: './who.component.html',
  styleUrl: './who.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhoComponent {
  public klassesService = inject(KlassesService);

  public master = input(false);
  public user = input.required<HwUser>();
  public character = input<HwCharacter | undefined>(undefined);

  public image = computed(() => {
    if (this.master()) {
      return '/characters/zargon.png';
    }

    const character = this.character();

    if (!character) {
      return '/characters/pending.gif';
    }

    return this.klassesService.portrait(character.klass, character.gender);
  });

  public klass = computed(() => {
    if (this.master()) {
      return 'Master';
    }

    const character = this.character();

    if (!character) {
      return 'No class';
    }

    return this.klassesService.name(character.klass);
  });

  public name = computed(() => {
    if (this.master()) {
      return 'Zargon';
    }

    const character = this.character();

    if (!character) {
      return 'No name';
    }

    return character.name;
  });
}
