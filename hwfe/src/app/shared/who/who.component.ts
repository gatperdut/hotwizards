import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HwCharacter, portrait } from '@hw/shared/characters';
import { HwUser } from '@hw/shared/users';
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
  private klassesService = inject(KlassesService);

  public master = input(false);
  public user = input.required<HwUser>();
  public character = input<HwCharacter | undefined>(undefined);

  public image = computed(() => {
    if (this.master()) {
      return '/portraits/zargon.png';
    }

    const character = this.character();

    if (!character) {
      return '/portraits/pending.gif';
    }

    return portrait(character.klass, character.gender);
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
