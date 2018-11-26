/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Globals } from './globals';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalComponent } from './pages/events/modal/modal.component';
import { ThumbnailModalComponent } from './pages/events/modal/thumbnailModal.component';
import { DeleteModalComponent } from './pages/events/modal/deleteModal.component';
import { NotificationModalComponent } from './pages/events/modal/NotificationModal.component';
import { GalleryModalComponent } from './pages/events/modal/galleryModal.component';
import { ModalPaymentComponent } from './pages/payments/payment-list/modal-payment.component'
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoaderService } from './loader.service';
import { ToasterModule } from 'angular2-toaster';
import { enableProdMode } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { AddModalComponent } from './pages/attendance/modal/add-modal.component';
import { DataService } from './data.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeStatusModalComponent } from './models/change-status.model';
import { LinkProfileComponent } from './pages/members/member-list/link-profile.component'
import { ConsultationComponent } from './pages/members/member-list/consultation.component';
import { Ng2TableModule } from './@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import {ImageUploadModalComponent} from "./pages/chat/image-upload-modal/image-upload-modal.component";
import { OrderModule } from 'ngx-order-pipe';


let environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCizwrEaWY8SktltxwPracg7xV0pswuMLU",
    authDomain: "appyapp-3588e.firebaseapp.com",
    databaseURL: "https://appyapp-3588e.firebaseio.com",
    projectId: "appyapp-3588e",
    storageBucket: "appyapp-3588e.appspot.com",
    messagingSenderId: "255969703319"
  }
}

const environmentchat = window['firebase'] || {
  production: false,
  firebasechat: {
    apiKey: "AIzaSyBi82prsd74vN5sQYIWG-Jf_yn0yza1lxc",
    authDomain: "nuhabit-8cb35.firebaseapp.com",
    databaseURL: "https://nuhabit-8cb35.firebaseio.com",
    projectId: "nuhabit-8cb35",
    storageBucket: "nuhabit-8cb35.appspot.com",
    messagingSenderId: "747662715475"
  }
}


@NgModule({
  declarations: [AppComponent,
    ModalComponent,
    ThumbnailModalComponent,
    DeleteModalComponent,
    NotificationModalComponent,
    GalleryModalComponent,
    AddModalComponent,
    ChangeStatusModalComponent,
    LinkProfileComponent,
    ConsultationComponent,
    ImageUploadModalComponent,
    ModalPaymentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    HttpClientModule,
    FileUploadModule,
    CKEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularFireModule,
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule.initializeApp(environmentchat.firebasechat),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ToasterModule,
    CalendarModule.forRoot(),
    AngularMultiSelectModule,
    ReactiveFormsModule,
    Ng2TableModule,
    PaginationModule.forRoot(),
    OrderModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    Globals,
    LoaderService,
    DataService,
  ],
  entryComponents: [
    ModalComponent,
    ThumbnailModalComponent,
    DeleteModalComponent,
    NotificationModalComponent,
    LinkProfileComponent,
    ConsultationComponent,
    GalleryModalComponent,
    AddModalComponent,
    ChangeStatusModalComponent,
    ImageUploadModalComponent,
    ModalPaymentComponent
  ],
})
export class AppModule {
}
