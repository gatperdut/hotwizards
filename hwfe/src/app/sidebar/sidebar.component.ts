import { Component, input } from '@angular/core';
import {
  SidebarButtonAction,
  SidebarButtonComponent,
} from './sidebar-button/sidebar-button.component';

export type SidebarButton = {
  icon: string;
  callback?: () => void;
  actions?: SidebarButtonAction[];
  color?: 'primary' | 'secondary' | 'warning';
  disabled?: boolean;
  autoClose?: boolean;
};

@Component({
  selector: 'app-sidebar',
  imports: [SidebarButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  public buttons = input.required<SidebarButton[]>();
}
