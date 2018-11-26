import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { VisitorEditComponent } from './visitor-edit/visitor-edit.component';
import {VisitorComponent } from './visitor.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: VisitorComponent,
    children: [
      { path: '', component: VisitorListComponent, pathMatch: 'full'},
      { path: 'add', component: VisitorEditComponent},

    ]
  },
  { path: '', component: VisitorListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
