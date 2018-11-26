import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { AddPaymentConfigurationComponent } from './add-payment-configuration/add-payment-configuration.component';
import { PaymentConfigurationComponent } from './payment-configuration.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: PaymentConfigurationComponent,
    children: [
      { path: '', component: AddPaymentConfigurationComponent, pathMatch: 'full'},
      { path: 'add', component: AddPaymentConfigurationComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: AddPaymentConfigurationComponent, pathMatch: 'full'},

];

export const routing = RouterModule.forChild(routes);
