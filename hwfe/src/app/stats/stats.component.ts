import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent {
  public bodyPoints = input.required<number | null>();
  public maxBodyPoints = input.required<number>();
  public mindPoints = input.required<number | null>();
  public maxMindPoints = input.required<number>();
  public movementPoints = input.required<number | null>();
  public maxMovementPoints = input.required<number | string>();
  public attackDie = input.required<number>();
  public defendDie = input.required<number>();
}
