import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './faq.routing';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqEditComponent } from './faq-edit/faq-edit.component';
import { FaqComponent } from './faq.component';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
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
    ReactiveFormsModule,
    NgxPaginationModule,
    OrderModule
  ],
  declarations: [
    FaqListComponent,
    FaqComponent,
    FaqEditComponent
  ],
  providers: [

  ],
  // entryComponents: [ModalComponent,
  //   ThumbnailModalComponent
  // ]
})
export class FaqModule {


}

