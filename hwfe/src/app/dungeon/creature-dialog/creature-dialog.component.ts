import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HwCreature, HwHero, HwMonster } from '@hw/shared/dungeon';
import { HwUser } from '@hw/shared/users';
import { WhoCharacterComponent } from '../../shared/who-character/who-character.component';
import { WhoMonsterComponent } from '../../shared/who-monster/who-monster.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DialogRef } from '../../ui/dialog/dialog-ref.class';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { DialogActionsDirective } from '../../ui/dialog/directives/dialog-actions.directive';
import { DialogContentDirective } from '../../ui/dialog/directives/dialog-content.directive';
import { DialogTitleDirective } from '../../ui/dialog/directives/dialog-title.directive';
import { APP_DIALOG_DATA } from '../../ui/dialog/services/dialog.service';

export type CreatureDialogData = {
  master: HwUser;
  user: HwUser | null;
  creature: HwCreature;
};

export type CreatureDialogResult = void;

@Component({
  selector: 'app-creature-dialog',
  imports: [
    DialogComponent,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ButtonComponent,
    WhoCharacterComponent,
    WhoMonsterComponent,
  ],
  templateUrl: './creature-dialog.component.html',
  styleUrl: './creature-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatureDialogComponent {
  public data = inject<CreatureDialogData>(APP_DIALOG_DATA);
  public dialogRef = inject<DialogRef<CreatureDialogResult>>(DialogRef);

  public hero = this.data.creature as HwHero;
  public monster = this.data.creature as HwMonster;
}
