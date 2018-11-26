import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberComponent } from './member.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      { path: '', component: MemberListComponent, pathMatch: 'full'},
      { path: 'add', component: MemberEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: MemberEditComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: MemberListComponent, pathMatch: 'full'},

];

export const routing = RouterModule.forChild(routes);
