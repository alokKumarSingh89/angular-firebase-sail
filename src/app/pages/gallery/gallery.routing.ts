import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryAddComponent } from './gallery-add/gallery-add.component';
import { GalleryComponent } from './gallery.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: GalleryComponent,
    children: [
      { path: '', component: GalleryListComponent, pathMatch: 'full'},
      { path: 'add', component: GalleryAddComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: GalleryAddComponent, pathMatch: 'full'}

    ]
  },
  { path: '', component: GalleryListComponent, pathMatch: 'full'},

];



export const routing = RouterModule.forChild(routes);
