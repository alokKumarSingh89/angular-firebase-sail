import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { map } from 'rxjs/operators';
import { ChatMessage } from "../../../models/chat-message.model";
import { Observable } from "rxjs/Observable";
import { Conversation } from '../../../models/conversation.model';
import { UserService } from '../../../@core/data/users.service';
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  email: string = localStorage.getItem('email');
  emailId: string;
  users: any;
  selectedConversation: Conversation;
  feed: Observable<ChatMessage[]>;
  conversationName = '';
  memberList = '';
  picture = '';
  imageUrl: string[] = [];
  constructor(private chatService: ChatService, private userService: UserService) {
  }
  conversations: Conversation[];
  ngOnInit() {
  }
  setConversationId(conversation) {
    console.log("conversation",conversation)
    if (conversation) {
      this.selectedConversation = conversation;
      this.feed = this.chatService.getMessages(conversation.appyID).valueChanges();
      this.setConversastionHeader(conversation)
    } else {
      this.selectedConversation = conversation;
      this.feed = null;
      this.reset();
    }

  }
  goToDeleteConversation(){
    this.chatService.deleteQuickChatUser(this.selectedConversation.$key)
  }
  reset(){
    this.picture = "";
    this.conversationName = ""
    this.memberList = ''
  }
  setConversastionHeader(conversation: Conversation) {
    
    const participants = conversation.participantsCS.trim().split(',');
    const emailList = participants.filter((data) => this.email != data);
    this.conversationName = emailList[0];
    this.memberList = '';
    this.imageUrl = [];
    this.picture = conversation.iconURL ? conversation.iconURL : 'https://s3-ap-southeast-2.amazonaws.com/nuhabit-dementiaapp001-gmail.com/5b7ceca03f2235f614d83e98_default.png';
  }
}
