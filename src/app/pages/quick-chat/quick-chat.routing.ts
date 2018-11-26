import { Routes, RouterModule } from '@angular/router';
import { QuickChatComponent } from './quick-chat.component';
import {ChatListComponent} from './chat-list/chat-list.component'
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: QuickChatComponent,
    children: [
      { path: '', component: ChatListComponent, pathMatch: 'full'}

    ]
  }
];



export const routing = RouterModule.forChild(routes);
