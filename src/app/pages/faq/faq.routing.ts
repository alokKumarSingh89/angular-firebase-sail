import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqEditComponent } from './faq-edit/faq-edit.component';
import { FaqComponent } from './faq.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    children: [
      { path: '', component: FaqListComponent, pathMatch: 'full'},
      { path: 'add', component: FaqEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: FaqEditComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: FaqListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
