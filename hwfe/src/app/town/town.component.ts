import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '@hw/hwfe/app/shared/confirmation-dialog/confirmation-dialog.component';
import { UserMenuComponent } from '@hw/hwfe/app/shared/user-menu/user-menu.component';
import { WhoCharacterComponent } from '@hw/hwfe/app/shared/who-character/who-character.component';
import { ButtonComponent } from '@hw/hwfe/app/ui/button/button.component';
import { DialogService, LazyDialog } from '@hw/hwfe/app/ui/dialog/services/dialog.service';
import { ToastService } from '@hw/hwfe/app/ui/toast/services/toast.service';
import { SocketService } from '@hw/hwfe/sockets/socket.service';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwItem, HwItemSlots } from '@hw/shared/inventory';
import {
  CampaignsSingleDownstream,
  CampaignsSingleUpstream,
  CharactersDownstream,
  CharactersUpstream,
  MembershipsSingleDownstream,
  MembershipsSingleUpstream,
} from '@hw/shared/sockets';
import { catchError, EMPTY, filter, from, of, switchMap, tap } from 'rxjs';
import { Socket } from 'socket.io-client';
import {
  AdventurePickerAction,
  AdventureTemplatePickerComponent,
} from '../adventure-templates/adventure-template-picker/adventure-template-picker.component';
import { CampaignService } from '../campaigns/campaign/campaign.service';
import { CampaignsApiService } from '../campaigns/services/campaigns-api.service';
import { CharactersApiService } from '../characters/services/characters-api.service';
import { TownMembershipComponent } from './town-membership/town-membership.component';
import { TownStashComponent } from './town-stash/town-stash.component';

@Component({
  selector: 'app-town',
  imports: [
    ButtonComponent,
    TownMembershipComponent,
    TownStashComponent,
    WhoCharacterComponent,
    AdventureTemplatePickerComponent,
    UserMenuComponent,
  ],
  templateUrl: './town.component.html',
  styleUrl: './town.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownComponent {
  public campaignService = inject(CampaignService);
  private router = inject(Router);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private campaignsApiService = inject(CampaignsApiService);
  private charactersApiService = inject(CharactersApiService);
  private dialogService = inject(DialogService);

  private campaignsSingleSocket!: Socket<CampaignsSingleDownstream, CampaignsSingleUpstream>;
  private membershipsSingleSocket!: Socket<MembershipsSingleDownstream, MembershipsSingleUpstream>;
  private charactersSocket!: Socket<CharactersDownstream, CharactersUpstream>;

  constructor() {
    this.campaignsSingleSocket = this.socketService.socket('campaigns-single', this.destroyRef, {
      campaignId: this.campaignService.campaign().id,
    });
    this.membershipsSingleSocket = this.socketService.socket(
      'memberships-single',
      this.destroyRef,
      { campaignId: this.campaignService.campaign().id },
    );
    this.charactersSocket = this.socketService.socket('characters', this.destroyRef, {
      campaignId: this.campaignService.campaign().id,
    });

    this.campaignsListen();
    this.membershipsListen();
    this.charactersListen();
  }

  private campaignsListen(): void {
    this.campaignsSingleSocket.on('downDeleteCampaign', () => {
      this.toastService.show({
        message: `Campaign ${this.campaignService.campaign().name} has been deleted`,
      });
      this.back();
    });

    this.campaignsSingleSocket.on('downUpdateCampaign', () => {
      this.refresh();
    });

    this.campaignsSingleSocket.on('downStartAdventure', () => {
      this.campaignsApiService
        .get(this.campaignService.campaign().id)
        .pipe(
          tap((campaign) => {
            this.campaignService.campaign.set(campaign);

            this.toastService.show({
              message: `The adventure has started: ${campaign.adventure!.template.name}`,
            });
            void this.router.navigate([
              'home',
              'campaigns',
              this.campaignService.campaign().id,
              'dungeon',
            ]);
          }),
        )
        .subscribe();
    });
  }

  private membershipsListen(): void {
    this.membershipsSingleSocket.on('downCreateMemberships', (_membershipIds) => {
      this.refresh();
    });

    this.membershipsSingleSocket.on('downKickoutMembership', (campaignName, masterHandle) => {
      this.campaignsApiService
        .get(this.campaignService.campaign().id)
        .pipe(
          catchError(() => {
            this.toastService.show({
              message: `${masterHandle} has kicked you out of ${campaignName}`,
            });

            this.back();

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.refresh(campaign);
        });
    });

    this.membershipsSingleSocket.on('downAbandonMembership', (memberHandle) => {
      this.campaignsApiService
        .get(this.campaignService.campaign().id)
        .pipe(
          catchError(() => {
            this.back();

            return EMPTY;
          }),
        )
        .subscribe((campaign) => {
          this.refresh(campaign);

          this.toastService.show({
            message: `${memberHandle} has abandoned ${campaign.name}`,
          });
        });
    });

    this.membershipsSingleSocket.on('downUpdateMembership', (membershipId) => {
      this.campaignsApiService.get(this.campaignService.campaign().id).subscribe((campaign) => {
        this.refresh(campaign);

        if (campaign.master.me) {
          const membership = campaign.memberships.find((m) => m.id === membershipId);

          if (!membership) {
            return;
          }

          this.toastService.show({
            message: `${membership.user.handle} has joined your campaign ${campaign.name}`,
          });
        }
      });
    });
  }

  private charactersListen(): void {
    this.charactersSocket.on('downEquipItem', (characterId, backpackItemId) => {
      const inventory = this.campaignService
        .memberships()
        .find((m) => m.characterId === characterId)!.character!.inventory;

      const backpackItem = inventory.backpack.items.find((item) => item.id === backpackItemId)!;
      inventory.gear[HwItemSlots[backpackItem.name]!] = backpackItem;
      inventory.backpack.items = inventory.backpack.items.filter(
        (item) => item.id !== backpackItemId,
      );

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        memberships: campaign.memberships.map((m) => {
          if (m.characterId !== characterId) {
            return m;
          }
          return {
            ...m,
            character: {
              ...m.character!,
              inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
            },
          };
        }),
      }));
    });

    this.charactersSocket.on('downUnequipItem', (characterId, slot) => {
      const inventory = this.campaignService
        .memberships()
        .find((m) => m.characterId === characterId)!.character!.inventory;

      const gearItem = inventory.gear[slot]!;
      inventory.backpack.items.push(gearItem);
      inventory.gear[slot] = null;

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        memberships: campaign.memberships.map((m) => {
          if (m.characterId !== characterId) {
            return m;
          }
          return {
            ...m,
            character: {
              ...m.character!,
              inventory: { gear: { ...inventory.gear }, backpack: { ...inventory.backpack } },
            },
          };
        }),
      }));
    });

    this.charactersSocket.on('downDropItem', (characterId, backpackItemId) => {
      const inventory = this.campaignService
        .memberships()
        .find((m) => m.characterId === characterId)!.character!.inventory;

      const stash = this.campaignService.campaign().stash;

      const backpackItem = inventory.backpack.items.find((item) => item.id === backpackItemId)!;
      inventory.backpack.items = inventory.backpack.items.filter(
        (item) => item.id !== backpackItemId,
      );
      stash.items.push(backpackItem);

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        stash: {
          ...campaign.stash,
        },
        memberships: campaign.memberships.map((m) => {
          if (m.characterId !== characterId) {
            return m;
          }
          return {
            ...m,
            character: {
              ...m.character!,
              inventory: {
                gear: {
                  ...inventory.gear,
                },
                backpack: {
                  ...inventory.backpack,
                },
              },
            },
          };
        }),
      }));
    });

    this.charactersSocket.on('downPickupItem', (characterId, stashItemId) => {
      const inventory = this.campaignService
        .memberships()
        .find((m) => m.characterId === characterId)!.character!.inventory;

      const stash = this.campaignService.campaign().stash;

      const stashItem = stash.items.find((item) => item.id === stashItemId)!;
      stash.items = stash.items.filter((item) => item.id !== stashItemId);
      inventory.backpack.items.push(stashItem);

      this.campaignService.campaign.update((campaign) => ({
        ...campaign,
        stash: {
          ...campaign.stash,
        },
        memberships: campaign.memberships.map((m) => {
          if (m.characterId !== characterId) {
            return m;
          }
          return {
            ...m,
            character: {
              ...m.character!,
              inventory: {
                gear: {
                  ...inventory.gear,
                },
                backpack: {
                  ...inventory.backpack,
                },
              },
            },
          };
        }),
      }));
    });
  }

  private refresh(campaign?: HwCampaign): void {
    (campaign
      ? of(campaign)
      : this.campaignsApiService.get(this.campaignService.campaign().id)
    ).subscribe((campaign) => {
      this.campaignService.campaign.set(campaign);
    });
  }

  public back(): void {
    void this.router.navigate(['home', 'campaigns']);
  }

  public adventurePickerActions: AdventurePickerAction[] = this.campaignService.campaign().master.me
    ? [
        {
          label: 'Start',
          action: (adventureTemplate: HwAdventureTemplate): void => {
            const dialog: LazyDialog<
              ConfirmationDialogComponent,
              ConfirmationDialogData,
              ConfirmationDialogResult
            > = {
              importFn: () =>
                import('../shared/confirmation-dialog/confirmation-dialog.component').then(
                  (m) => m.ConfirmationDialogComponent,
                ),
            };
            from(
              this.dialogService.open(dialog, {
                title: 'Start adventure',
                question: `Are you sure you want to start the adventure ${adventureTemplate.name}?`,
              }),
            )
              .pipe(
                switchMap((dialogRef) => dialogRef.afterClosed$),
                filter((confirmed) => !!confirmed),
                switchMap(() =>
                  this.campaignsApiService.startAdventure(
                    this.campaignService.campaign().id,
                    adventureTemplate.id,
                  ),
                ),
              )
              .subscribe();
          },
          disabled: () =>
            !this.campaignService.activeMemberships().length ||
            !!this.campaignService.pendingMemberships().length,
        },
      ]
    : [];

  public onPickup(stashItem: HwItem): void {
    this.charactersApiService
      .pickupItem(this.campaignService.myMembership()!.character!.id, stashItem.id)
      .subscribe();
  }

  public onPickupGold(amount: number): void {
    console.log(amount);
    this.charactersApiService
      .pickupGold(this.campaignService.myMembership()!.character!.id, amount)
      .subscribe();
  }
}
