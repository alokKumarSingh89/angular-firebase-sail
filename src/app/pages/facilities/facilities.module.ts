import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './facilities.routing';
import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import {FacilitiesComponent } from './facilities.component';
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
    FacilitiesListComponent,
    FacilitiesComponent,
    FacilitiesEditComponent
  ],
  providers: [

  ],

})
export class FacilitiesModule {

 
}

