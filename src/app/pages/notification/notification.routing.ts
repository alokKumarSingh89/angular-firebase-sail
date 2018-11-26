import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationEditComponent } from './notification-edit/notification-edit.component';
import { NotificationComponent } from './notification.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    children: [
      { path: '', component: NotificationListComponent, pathMatch: 'full'},
      { path: 'add', component: NotificationEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: NotificationEditComponent, pathMatch: 'full'},

    ]
  },
  { path: '', component: NotificationListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
