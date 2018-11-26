import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { CampaignComponent } from './campaign.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: CampaignComponent,
    children: [
      { path: '', component: CampaignListComponent, pathMatch: 'full'},
      { path: 'add', component: CampaignEditComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: CampaignEditComponent, pathMatch: 'full'},
    ]
  },
  // { path: '', component: EventListComponent, pathMatch: 'full'},
  { path: '', component: CampaignListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
