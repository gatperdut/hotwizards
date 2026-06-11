import { Component, computed, input } from '@angular/core';
import {
  creatureAttackDie,
  creatureBodyPoints,
  creatureDefendDie,
  creatureMindPoints,
  HwCreature,
  HwHero,
  HwMonster,
} from '@hw/shared/dungeon';

@Component({
  selector: 'app-creature-stats',
  imports: [],
  templateUrl: './creature-stats.component.html',
  styleUrl: './creature-stats.component.css',
})
export class CreatureStatsComponent {
  public creature = input.required<HwCreature>();

  public key = computed(() =>
    this.creature().alignment === 'HERO'
      ? (<HwHero>this.creature()).klass
      : (<HwMonster>this.creature()).type!,
  );
  public creatureBodyPoints = creatureBodyPoints;
  public creatureMindPoints = creatureMindPoints;
  public creatureAttackDie = creatureAttackDie;
  public creatureDefendDie = creatureDefendDie;
}
