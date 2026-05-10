import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdventureTemplatesApiService } from '../../adventure-templates/services/adventure-templates-api.service';
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

  public sidebarButtons: EditorSidebarButton[] = [
    {
      icon: 'arrow-uturn-left',
      callback: (): void => {
        void this.router.navigate(['home', 'campaigns']);
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
