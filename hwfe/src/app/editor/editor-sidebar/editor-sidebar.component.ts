import { Component } from '@angular/core';
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
  public sidebarButtons: EditorSidebarButton[] = [
    {
      icon: 'arrow-uturn-left',
      callback: (): void => {
        console.log('back');
      },
    },
    {
      icon: 'arrow-down-tray',
      actions: [
        {
          icon: 'arrow-uturn-left',
          callback: (): void => {
            console.log('chevron down');
          },
        },
        {
          icon: 'arrow-uturn-left',
          callback: (): void => {
            console.log('chevron up');
          },
        },
      ],
    },
  ];
}
