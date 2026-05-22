import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdventuresApiService } from '@hw/hwfe/app/adventures/services/adventures-api.service';
import { AuthService } from '../../auth/services/auth.service';
import { DungeonService } from '../services/dungeon.service';

// TODO see what we do with this. Needs to mimic the editor's.
@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public dungeonService = inject(DungeonService);
  private adventuresApiService = inject(AdventuresApiService);

  public logout(): void {
    this.authService.logout();
  }

  public toHome(): void {
    void this.router.navigate(['home']);
  }

  public back(): void {
    void this.router.navigate(['home', 'campaigns']);
  }

  public endTurn(): void {
    this.adventuresApiService.endTurn(this.dungeonService.adventure().id).subscribe();
  }

  public finish(): void {
    this.adventuresApiService.finishAdventure(this.dungeonService.adventure().id).subscribe();
  }
}
