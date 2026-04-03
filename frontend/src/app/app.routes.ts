import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthCallbackComponent } from './core/components/auth-callback/auth-callback.component';

export const routes: Routes = [
  {
    path: 'callback',
    component: AuthCallbackComponent,
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./features/showcase/showcase.component').then((m) => m.ShowcaseComponent),
  },
  {
    path: 'showcase/number',
    loadComponent: () =>
      import('./features/showcase/number/showcase-number.component').then((m) => m.ShowcaseNumberComponent),
  },
  {
    path: 'showcase/filter-panel',
    loadComponent: () =>
      import('./features/showcase/filter-panel/showcase-filter-panel.component').then((m) => m.ShowcaseFilterPanelComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
