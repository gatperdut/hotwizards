import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class AdventureProperTurnWsGuard implements CanActivate {
  public canActivate(executionContext: ExecutionContext): boolean {
    const request = executionContext.switchToWs().getClient<Socket>();
    const user = request.user;
    const campaign = request.campaign;
    const adventure = request.adventure;

    const userIds = [campaign.master.id, ...campaign.memberships.map((m) => m.userId)];

    if (userIds[adventure.turn] !== user.id) {
      throw new WsException('You are not on your turn');
    }

    return true;
  }
}
