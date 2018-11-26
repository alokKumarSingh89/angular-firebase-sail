import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentConfigurationComponent } from './payment-configuration.component';
import { AddPaymentConfigurationComponent } from './add-payment-configuration/add-payment-configuration.component';


import { ToasterModule } from 'angular2-toaster';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';

import { routing } from './payment-configuration.routing';

@NgModule({
  imports: [
    CommonModule,
    ToasterModule,
    ReactiveFormsModule,
    ThemeModule,
    routing
  ],
  declarations: [
    PaymentConfigurationComponent,
    AddPaymentConfigurationComponent
  ]
})
export class PaymentConfigurationModule { }
