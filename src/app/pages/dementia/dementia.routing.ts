import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { DementiaListComponent } from './dementia-list/dementia-list.component';
import { DementiaEditComponent } from './dementia-edit/dementia-edit.component';
import { UpdateComponent } from './dementia.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: UpdateComponent,
    children: [
      { path: '', component: DementiaListComponent, pathMatch: 'full'},
      { path: 'add', component: DementiaEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: DementiaEditComponent, pathMatch: 'full'},

    ]
  },
  { path: '', component: DementiaListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
