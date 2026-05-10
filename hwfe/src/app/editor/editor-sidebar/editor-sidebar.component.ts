import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AdventureTemplateEditorDialogComponent,
  AdventureTemplateEditorDialogData,
  AdventureTemplateEditorDialogResult,
} from '../../adventure-templates/adventure-template-editor-dialog/adventure-template-editor-dialog.component';
import { AdventureTemplatesApiService } from '../../adventure-templates/services/adventure-templates-api.service';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import { EditorService } from '../services/editor.service';
import {
  SidebarButtonAction,
  SidebarButtonComponent,
} from './sidebar-button/sidebar-button.component';

export type EditorSidebarButton = {
  icon: string;
  callback?: () => void;
  actions?: SidebarButtonAction[];
};

@Component({
  selector: 'app-editor-sidebar',
  imports: [SidebarButtonComponent],
  templateUrl: './editor-sidebar.component.html',
  styleUrl: './editor-sidebar.component.css',
  providers: [],
})
export class EditorSidebarComponent {
  private router = inject(Router);
  private editorService = inject(EditorService);
  private adventureTemplatesApiService = inject(AdventureTemplatesApiService);
  private dialogService = inject(DialogService);

  public sidebarButtons: EditorSidebarButton[] = [
    {
      icon: 'arrow-uturn-left',
      callback: (): void => {
        void this.router.navigate(['home', 'campaigns']);
      },
    },
    {
      icon: 'pencil',
      callback: (): void => {
        const adventureTemplate = this.editorService.adventureTemplate();
        const dungeon = this.editorService.dungeon();

        const dialog: LazyDialog<
          AdventureTemplateEditorDialogComponent,
          AdventureTemplateEditorDialogData,
          AdventureTemplateEditorDialogResult
        > = {
          importFn: () =>
            import('../../adventure-templates/adventure-template-editor-dialog/adventure-template-editor-dialog.component').then(
              (m) => m.AdventureTemplateEditorDialogComponent,
            ),
        };
        void this.dialogService.open(dialog, {
          adventureTemplateId: adventureTemplate.id,
          dto: { name: adventureTemplate.name, info: adventureTemplate.info, dungeon: dungeon },
        });
      },
    },
    {
      icon: 'arrow-down-tray',
      callback: (): void => {
        const adventureTemplate = this.editorService.adventureTemplate();
        const dungeon = this.editorService.dungeon();

        this.adventureTemplatesApiService
          .update(adventureTemplate.id, {
            name: adventureTemplate.name,
            info: adventureTemplate.info,
            dungeon: dungeon,
          })
          .subscribe();
      },
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
  ];
}
