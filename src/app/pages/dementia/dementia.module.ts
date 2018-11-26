import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './dementia.routing';
import { DementiaListComponent } from './dementia-list/dementia-list.component';
import { DementiaEditComponent } from './dementia-edit/dementia-edit.component';
import { UpdateComponent } from './dementia.component';
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
    DementiaListComponent,
    UpdateComponent,
    DementiaEditComponent
  ],
  providers: [

  ],

})
export class DementiaModule {

 
}

