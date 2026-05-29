import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HwMonster, monsterPortrait } from '@hw/shared/dungeon';

@Component({
  selector: 'app-who-monster',
  imports: [],
  templateUrl: './who-monster.component.html',
  styleUrl: './who-monster.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhoMonsterComponent {
  public master = input.required<boolean>();
  public monster = input.required<HwMonster>();

  public image = computed(() => {
    return monsterPortrait(this.monster().type!);
  });
}
