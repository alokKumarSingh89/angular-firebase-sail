import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  },{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'paymentconfig',
    loadChildren: './payment-configuration/payment-configuration.module#PaymentConfigurationModule',
  }, 
  {
    path: 'events',
    loadChildren: './events/event.module#EventModule',
  },
  {
    path: 'updates',
    loadChildren: './update/update.module#UpdateModule',
  },
  {
    path: 'notifications',
    loadChildren: './notification/notification.module#NotificationModule',
  },
  {
    path: 'facilities',
    loadChildren: './facilities/facilities.module#FacilitiesModule',
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule',
  },
  {
    path: 'quickchat',
    loadChildren: './quick-chat/quick-chat.module#QuickChatModule',
  },
  {
    path: 'members',
    loadChildren: './members/member.module#MemberModule',
  },
  {
    path: 'gallery',
    loadChildren: './gallery/gallery.module#GalleryModule',
  },
  {
    path: 'campaign',
    loadChildren: './campaign/campaign.module#CampaignModule',
  },  
  {
    path: 'bookings',
    loadChildren: './bookings/bookings.module#BookingsModule',
  }, 
  {
    path: 'attendance',
    loadChildren: './attendance/attendance.module#AttendanceModule',
  }, 
  {
    path: 'payments',
    loadChildren: './payments/payments.module#PaymentsModule',
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
  }, 
  {
    path: 'visitor',
    loadChildren: './visitor/visitor.module#VisitorModule',
  }, 
  {
    path: 'faq',
    loadChildren: './faq/faq.module#FaqModule',
  }, 
  {
    path: 'dementia',
    loadChildren: './dementia/dementia.module#DementiaModule',
  },
],    
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class PagesRoutingModule {
}
