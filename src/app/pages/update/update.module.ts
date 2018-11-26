import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './update.routing';
import { UpdateListComponent } from './update-list/update-list.component';
import { UpdateEditComponent } from './update-edit/update-edit.component';
import { UpdateComponent } from './update.component';
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
    ToasterModule,
    CKEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule
  ],
  declarations: [
    UpdateListComponent,
    UpdateComponent,
    UpdateEditComponent
  ],
  providers: [

  ],

})
export class UpdateModule {

 
}

