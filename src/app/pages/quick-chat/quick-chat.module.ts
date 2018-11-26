import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule, MatSidenavModule,
  MatToolbarModule, MatTooltipModule
} from "@angular/material";
import { routing } from './quick-chat.routing';
import {QuickChatComponent} from './quick-chat.component';
import { ChatListComponent } from './chat-list/chat-list.component'
import {ChatFormComponent} from './chat-form/chat-form.component';
import { FeedComponent } from './feed/feed.component';
import { MessageComponent } from './message/message.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserItemComponent } from './user-item/user-item.component'
// import { MessageComponent } from '../chat/message/message.component';

const materialModules = [
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    routing,
      ...materialModules,
  ],
  declarations: [QuickChatComponent, ChatListComponent,ChatFormComponent,
    FeedComponent,
    MessageComponent,
    UserListComponent,
    UserItemComponent],
  providers:[AngularFirestore,
    DatePipe]
})
export class QuickChatModule { }
