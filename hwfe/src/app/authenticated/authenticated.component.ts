import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { PresenceDownstream, PresenceUpstream } from '@hw/shared';
import { Socket } from 'socket.io-client';
import { PresenceService } from '../presence/presence.service';

@Component({
  selector: 'app-campaign',
  imports: [RouterOutlet],
  templateUrl: './authenticated.component.html',
  styleUrl: './authenticated.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PresenceService],
})
export class AuthenticatedComponent {
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private presenceService = inject(PresenceService);

  private socket!: Socket<PresenceDownstream, PresenceUpstream>;

  constructor() {
    this.socket = this.socketService.socket('presence', this.destroyRef);

    this.listen();

    this.socket.emit('upOnline');
  }

  private listen(): void {
    this.socket.on('downOnline', (user) => {
      this.presenceService.online.update((map) => new Map(map).set(user.id, user));
    });

    this.socket.on('downOnlineList', (users) => {
      this.presenceService.online.set(new Map(users.map((u) => [u.id, u])));
    });

    this.socket.on('downOffline', (user) => {
      this.presenceService.online.update((map) => {
        const next = new Map(map);
        next.delete(user.id);
        return next;
      });
    });
  }
}
