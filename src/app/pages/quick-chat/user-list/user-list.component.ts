import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { Conversation } from '../../../models/conversation.model';
import { Observable } from 'rxjs/Observable';
import { forEach } from "@angular/router/src/utils/collection";
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { UserService } from '../../../@core/data/users.service';
import { LoaderService } from '../../../loader.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  groupConversation: Conversation[];
  conversations: Conversation[];
  enterprise_name: string = 'abc_software';
  email: string = localStorage.getItem('email');
  data: any;
  selectedConversationIndex: number;
  users: any[] = [];

  emailId: string;

  @Output() selectedConversation: EventEmitter<Conversation> = new EventEmitter();

  constructor(private chatService: ChatService, private userService: UserService, private loadService: LoaderService) {
    
  }

  ngOnInit() {
    this.loadService.display(true);
    this.chatService.getQuickChatUser().valueChanges().subscribe(chats => {
      let userTemp = []
      this.users = [];
      chats.forEach(chat => {
        if (chat.createdBy != this.email) {
          if (userTemp.indexOf(chat.createdBy) == -1) {
            this.users.push(chat)
            userTemp.push(chat.createdBy)
          }
        }
      })
      if(this.users.length){
        this.userService.setChatUserList(this.users)
        this.getSelectedUserConversation(this.email, this.users[0].createdBy);
      }
      this.loadService.display(false);
    })
  }

  setSelectedEmailId(emailId) {
    this.emailId = emailId;
    this.getSelectedUserConversation(this.email, this.emailId);
  }

  setSelectedConversation(conversation) {
    this.selectedConversation.emit(conversation);

  }

  setClickedRow(index) {
    this.selectedConversationIndex = index;

  }

  getSelectedUserConversation(logineUser: string, otherUser: string) {
    this.loadService.display(true);
    this.chatService.getSelectedUserQickConversation(otherUser).snapshotChanges().pipe(
      map(changes =>{
        return changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
      })
    ).subscribe(
      data => {
        this.conversations = data;
        this.loadService.display(false);
        this.selectedConversation.emit(this.conversations[0]);

      })
  }
}
