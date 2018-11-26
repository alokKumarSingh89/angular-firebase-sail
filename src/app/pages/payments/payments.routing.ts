import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
// import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import {PaymentsComponent } from './payments.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      { path: '', component: PaymentListComponent, pathMatch: 'full'},
      // { path: 'add', component: FacilitiesEditComponent, pathMatch: 'full'},
      // { path: 'edit/:id', component: FacilitiesEditComponent, pathMatch: 'full'},

    ]
  },
  { path: '', component: PaymentListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
