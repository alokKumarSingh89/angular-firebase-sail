import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './gallery.routing';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryAddComponent } from './gallery-add/gallery-add.component';
import { GalleryComponent } from './gallery.component';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from '../../@theme/modules/ng2-table/ng2-table';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    Ng2TableModule,
    PaginationModule.forRoot(),
    ToasterModule,
    CKEditorModule,
    ReactiveFormsModule
   
  ],
  declarations: [
    GalleryListComponent,
    GalleryComponent,
    GalleryAddComponent
  ],
  providers: [

  ]
})
export class GalleryModule {


}

