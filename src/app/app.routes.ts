import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  permissionGuard,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { AdminPage } from './pages/admin/admin.page';
import { DefaultLayout } from './layouts/default/default.layout';
import { Permission } from '../security';
import { TasksPage } from './pages/tasks/tasks.page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: 'tasks',
        component: TasksPage,
        canActivate: [permissionGuard<Permission>(['manage-tasks'])],
      },
      {
        path: 'admin',
        component: AdminPage,
        canActivate: [permissionGuard<Permission>(['view-secrets'])],
      },

      { path: 'server-error', component: ServerErrorPage },
      { path: 'forbidden', component: ForbiddenPage },
      { path: 'auth-error', component: AuthErrorPage },
      { path: '', pathMatch: 'full', component: HomePage },
      { path: '**', component: NotFoundPage },
    ],
  },
];
