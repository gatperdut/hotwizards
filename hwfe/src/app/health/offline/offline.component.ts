import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineComponent {}
