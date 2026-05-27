import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class AdventureCampaignMasterWsGuard implements CanActivate {
  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToWs().getClient<Socket>();
    const user = request.user;
    const campaign = request.campaign;

    if (campaign.master.id !== user.id) {
      throw new WsException('You are not the master of the campaign');
    }

    return true;
  }
}
