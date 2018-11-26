import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
// import { EventComponent } from './event/event.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { PagesService } from './pages.service';
import { FileUploadModule } from "ng2-file-upload"; 
import { ToasterModule } from 'angular2-toaster';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    CKEditorModule,
    FileUploadModule,
    ToasterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    ...PAGES_COMPONENTS
  ],

  providers: [PagesService]
})
export class PagesModule {
}
