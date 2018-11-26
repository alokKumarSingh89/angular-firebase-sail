import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { routing } from './chat.routing';
import { ChatListComponent } from './chat-list/chat-list.component';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { ChatroomComponent } from './chat-room/chat-room.component';
import { MessageComponent } from './message/message.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserItemComponent } from './user-item/user-item.component';
import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { GroupChatItemComponent } from './group-chat-item/group-chat-item.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule, MatSidenavModule,
  MatToolbarModule, MatTooltipModule
} from "@angular/material";
import { EditChatGroupComponent } from './edit-chat-group/edit-chat-group.component';

const materialModules = [
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule
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
  declarations: [
    ChatComponent,
    ChatListComponent,
    ChatFormComponent,
    ChatroomComponent,
    MessageComponent,
    UserListComponent,
    UserItemComponent,
    FeedComponent,
    ChatGroupComponent,
    GroupChatItemComponent,
    EditChatGroupComponent,
  ],
  providers: [
    AngularFirestore,
    DatePipe
  ]
})
export class ChatModule {

}

