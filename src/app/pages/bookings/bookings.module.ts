import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './bookings.routing';
import { BookingListComponent } from './bookings-list/bookings-list.component';
import { BookingAddComponent } from './booking-add/booking-add.component';
import { BookingComponent } from './bookings.component';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../demo-utils/module';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReactiveFormsModule } from '@angular/forms';
// import { ModalComponent } from '../events/modal/modal.component';
// import { ThumbnailModalComponent } from '../events/thumbnailModal.component';
import { BookingEventListComponent } from './bookings-event-list/bookings-event-list.component';
import { BookingEventAddComponent } from './booking-event-add/booking-event-add.component';
// import { BookingEventComponent } from './../bookings-event/index';
import { BookingAppointmentComponent } from './booking-appointment/booking-appointment.component';
import { BookingAppointmentListComponent } from './bookings-appointment-list/bookings-appointment-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    CalendarModule,
    DemoUtilsModule,
    ToasterModule,
    CKEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    // BookingsEventModule,
    // BookingEventComponent

  ],
  declarations: [
    BookingListComponent,
    BookingComponent,
    BookingAddComponent,
    BookingEventListComponent,
    BookingEventAddComponent,
    BookingAppointmentComponent,
    BookingAppointmentListComponent
  ],
  providers: [

  ]
})
export class BookingsModule {


}

