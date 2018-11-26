import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { UpdateListComponent } from './update-list/update-list.component';
import { UpdateEditComponent } from './update-edit/update-edit.component';
import { UpdateComponent } from './update.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: UpdateComponent,
    children: [
      { path: '', component: UpdateListComponent, pathMatch: 'full'},
      { path: 'add', component: UpdateEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: UpdateEditComponent, pathMatch: 'full'},

    ]
  },
  { path: '', component: UpdateListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
