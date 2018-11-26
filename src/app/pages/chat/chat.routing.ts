import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatComponent } from './chat.component';
import {ChatGroupComponent} from './chat-group/chat-group.component';
import {EditChatGroupComponent} from "./edit-chat-group/edit-chat-group.component";
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      { path: '', component: ChatListComponent, pathMatch: 'full'},
      { path: 'add', component: ChatGroupComponent, pathMatch: 'full'},
      { path: 'edit/:id', component: EditChatGroupComponent}

    ]
  }
];



export const routing = RouterModule.forChild(routes);
