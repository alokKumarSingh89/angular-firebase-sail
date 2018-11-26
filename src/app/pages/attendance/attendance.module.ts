import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './attendance.routing';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
// import { MemberEditComponent } from './member-edit/member-edit.component';
import { AttendanceComponent } from './attendance.component';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from '../../@theme/modules/ng2-table/ng2-table';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
// import { AddModalComponent } from './modal/add-modal.component';
// import { ThumbnailModalComponent } from './modal/thumbnailModal.component';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../demo-utils/module';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

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
    DemoUtilsModule,
    CalendarModule


  ],
  declarations: [
    AttendanceListComponent,
    AttendanceComponent,
    // MemberEditComponent,
    // ModalComponent,
    // ThumbnailModalComponent
  ],
  providers: [

  ],
  // entryComponents: [ModalComponent,
  //   ThumbnailModalComponent
  // ]
})
export class AttendanceModule {


}

