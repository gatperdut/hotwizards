import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { PresenceDownstream, PresenceUpstream } from '@hw/shared/sockets';
import { Socket } from 'socket.io-client';
import { PresenceService } from '../presence/presence.service';

@Component({
  selector: 'app-authenticated',
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

  private presenceSocket!: Socket<PresenceDownstream, PresenceUpstream>;

  constructor() {
    this.presenceSocket = this.socketService.socket('presence', this.destroyRef);

    this.listen();

    this.presenceSocket.emit('upOnline');
  }

  private listen(): void {
    this.presenceSocket.on('downOnline', (user) => {
      this.presenceService.online.update((map) => new Map(map).set(user.id, user));
    });

    this.presenceSocket.on('downOnlineList', (users) => {
      this.presenceService.online.set(new Map(users.map((u) => [u.id, u])));
    });

    this.presenceSocket.on('downOffline', (user) => {
      this.presenceService.online.update((map) => {
        const next = new Map(map);
        next.delete(user.id);
        return next;
      });
    });
  }
}
