import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './notification.routing';
import {NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationEditComponent } from './notification-edit/notification-edit.component';
import { NotificationComponent } from './notification.component';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from '../../@theme/modules/ng2-table/ng2-table';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule


  ],
  declarations: [
    NotificationListComponent,
    NotificationComponent,
    NotificationEditComponent,
  ],
  providers: [

  ],

})
export class NotificationModule {
 
    
}

