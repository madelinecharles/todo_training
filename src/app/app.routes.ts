import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  permissionGuard,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { DefaultLayout } from './layouts/default/default.layout';
import { AdminPage } from './pages/admin/admin.page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: 'admin',
        component: AdminPage,
        canActivate: [permissionGuard(['manage-users'])],
      },
      { path: 'server-error', component: ServerErrorPage },
      { path: 'forbidden', component: ForbiddenPage },
      { path: 'auth-error', component: AuthErrorPage },
      { path: '', pathMatch: 'full', component: HomePage },
      { path: '**', component: NotFoundPage },
    ],
  },
];
