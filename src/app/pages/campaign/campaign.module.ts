import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './campaign.routing';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { CampaignComponent } from './campaign.component';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    ThemeModule


  ],
  declarations: [
    CampaignListComponent,
    CampaignComponent,
    CampaignEditComponent,
  ],
  providers: [
    NgbActiveModal,
  ]
})
export class CampaignModule {


}

