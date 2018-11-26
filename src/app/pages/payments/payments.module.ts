import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './payments.routing';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentsComponent } from './payments.component';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    Ng2TableModule,
    PaginationModule.forRoot(),
    ToasterModule,
    CKEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule


  ],
  declarations: [
    PaymentListComponent,
    PaymentsComponent
  ],
  providers: [

  ],

})
export class PaymentsModule {


}

