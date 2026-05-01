import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  imports: [RouterOutlet],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayComponent {
  private activatedRoute = inject(ActivatedRoute);
  private playService = inject(PlayService);

  constructor() {
    this.playService.campaign.set(this.activatedRoute.snapshot.data['campaign']);
  }
}
