import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { filter, from, switchMap, tap } from 'rxjs';
import {
  SaveAdventureTemplateDialogComponent,
  SaveAdventureTemplateDialogData,
  SaveAdventureTemplateDialogResult,
} from '../../adventure-templates/save-adventure-template-dialog/save-adventure-template-dialog.component';
import {
  InfoDialogComponent,
  InfoDialogData,
  InfoDialogResult,
} from '../../shared/info-dialog/info-dialog.component';
import { SidebarButton, SidebarComponent } from '../../sidebar/sidebar.component';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { EditorService } from '../services/editor.service';

@Component({
  selector: 'app-editor-sidebar',
  imports: [SidebarComponent],
  templateUrl: './editor-sidebar.component.html',
  styleUrl: './editor-sidebar.component.css',
})
export class EditorSidebarComponent {
  private router = inject(Router);
  private editorService = inject(EditorService);
  private dialogService = inject(DialogService);

  public buttons = signal<SidebarButton[]>([
    {
      icon: 'arrow-uturn-left',
      callback: (): void => {
        void this.router.navigate(['home', 'campaigns']);
      },
    },
    {
      icon: 'arrow-down-tray',
      color: this.editorService.errors().length ? 'warning' : 'primary',
      callback: (): void => {
        if (this.editorService.errors().length) {
          const dialog: LazyDialog<InfoDialogComponent, InfoDialogData, InfoDialogResult> = {
            importFn: () =>
              import('../../shared/info-dialog/info-dialog.component').then(
                (m) => m.InfoDialogComponent,
              ),
          };

          void this.dialogService.open(dialog, {
            title: 'There are errors in the dungeon',
            info: this.editorService.errors().join('\n'),
          });
        } else {
          const adventureTemplate = this.editorService.adventureTemplate();
          const dungeon = this.editorService.hwDungeon();

          const dialog: LazyDialog<
            SaveAdventureTemplateDialogComponent,
            SaveAdventureTemplateDialogData,
            SaveAdventureTemplateDialogResult
          > = {
            importFn: () =>
              import('../../adventure-templates/save-adventure-template-dialog/save-adventure-template-dialog.component').then(
                (m) => m.SaveAdventureTemplateDialogComponent,
              ),
          };
          from(
            this.dialogService.open(dialog, {
              adventureTemplateId: adventureTemplate.id,
              dto: {
                name: adventureTemplate.name,
                info: adventureTemplate.info,
                dungeon: dungeon,
              },
            }),
          )
            .pipe(
              switchMap((dialogRef) => dialogRef.afterClosed$),
              filter((adventureTemplate) => !!adventureTemplate),
              tap((adventureTemplate: HwAdventureTemplate): void => {
                this.editorService.adventureTemplate.set({
                  ...adventureTemplate,
                  dungeon: dungeon,
                });
              }),
            )
            .subscribe();
        }
      },
      disabled: !this.editorService.hwfeEditorDungeon(),
    },
    {
      icon: 'pencil',
      actions: [
        {
          icon: 'arrow-uturn-left',
          callback: (): void => {
            console.log('second btn');
          },
        },
        {
          icon: 'arrow-uturn-left',
          callback: (): void => {
            console.log('second btn');
          },
        },
      ],
    },
  ]);
}
