import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HwCharacter, characterPortrait } from '@hw/shared/characters';
import { HwUser } from '@hw/shared/users';
import { KlassesService } from '../../characters/services/klasses.service';
import { OnlineMarkComponent } from '../../users/online-mark/online-mark.component';

@Component({
  selector: 'app-who-character',
  imports: [OnlineMarkComponent],
  templateUrl: './who-character.component.html',
  styleUrl: './who-character.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhoCharacterComponent {
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

    return characterPortrait(character.klass, character.gender);
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
