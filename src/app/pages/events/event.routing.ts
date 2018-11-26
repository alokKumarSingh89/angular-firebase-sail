import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventComponent } from './event.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      { path: '', component: EventListComponent, pathMatch: 'full'},
      { path: 'add', component: EventEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: EventEditComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: EventListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
