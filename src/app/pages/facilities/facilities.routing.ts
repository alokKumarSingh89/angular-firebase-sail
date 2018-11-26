import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import {FacilitiesComponent } from './facilities.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FacilitiesComponent,
    children: [
      { path: '', component: FacilitiesListComponent, pathMatch: 'full'},
      { path: 'add', component: FacilitiesEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: FacilitiesEditComponent, pathMatch: 'full'},

    ]
  },
  { path: '', component: FacilitiesListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
