import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileEditComponent }  from './profile-edit/profile-edit.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: 'add', component: ProfileEditComponent, pathMatch: 'full'},
      { path: 'edit', component: ProfileEditComponent, pathMatch: 'full'},
    ]
  },
];

export const routing = RouterModule.forChild(routes);
