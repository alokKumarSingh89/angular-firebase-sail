import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { Conversation } from '../../../models/conversation.model';
import { Observable } from 'rxjs/Observable';
import { forEach } from "@angular/router/src/utils/collection";
import { map } from 'rxjs/operators';
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
  users: any;

  emailId: string;

  @Output() selectedConversation: EventEmitter<Conversation> = new EventEmitter();

  constructor(private chatService: ChatService) {
    // chatService.getUsers().subscribe(users => {
    //   this.users = users.filter(user => user.email !== this.email);
    // });
    // this.getSelectedUserConversation(this.email, this.users[0].email);
    
  }

  ngOnInit() {
    this.chatService.getConversations(this.enterprise_name, this.email).valueChanges().subscribe(
      data => {
        this.groupConversation = data
        if(this.groupConversation.length>0)
          this.setSelectedConversation(this.groupConversation[0])
      }
    );

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

    const participantsArray = [logineUser, otherUser];
    const participantsCS = this.chatService.getParticipantsList(participantsArray);
    this.chatService.getSelectedUserConversation(participantsCS).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(
      data => {
        this.conversations = data;
        if (this.conversations.length > 0) {
          this.selectedConversation.emit(this.conversations[0]);
        } else {
          const createdTime = new Date().getTime();
          this.chatService.sendConversation(this.email, createdTime, '', [],
            '', this.emailId, participantsArray, false,'');
        }
      })
  }
}
