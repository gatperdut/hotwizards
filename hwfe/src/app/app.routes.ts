import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'board',
      },
      {
        path: 'board',
        loadComponent: () => import('./board/board.component.js').then((m) => m.BoardComponent),
      },
    ],
  },
];
