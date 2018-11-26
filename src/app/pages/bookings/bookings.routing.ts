import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { BookingListComponent } from './bookings-list/bookings-list.component';
import { BookingAddComponent } from './booking-add/booking-add.component';
import { BookingComponent } from './bookings.component';
import { BookingAppointmentComponent } from './booking-appointment/booking-appointment.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [
      { path: '', component: BookingListComponent, pathMatch: 'full'},
      { path: 'add', component: BookingAddComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: BookingAddComponent, pathMatch: 'full'},
      { path: 'appointment', component: BookingAppointmentComponent, pathMatch: 'full'},
    ]
  },
  { path: '', component: BookingListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
