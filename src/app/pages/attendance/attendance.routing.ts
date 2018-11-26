import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
// import { MemberEditComponent } from './member-edit/member-edit.component';
import { AttendanceComponent } from './attendance.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    children: [
      { path: '', component: AttendanceListComponent, pathMatch: 'full'},
      // { path: 'add', component: AttendanceEditComponent, pathMatch: 'full'},
      // { path: 'edit/:id', component: AttendanceEditComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: AttendanceListComponent, pathMatch: 'full'},

];

export const routing = RouterModule.forChild(routes);
