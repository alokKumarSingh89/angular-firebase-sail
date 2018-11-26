import { Component, OnInit } from '@angular/core';
import {ChatMessage} from "../../../models/chat-message.model";
import {Observable} from "rxjs/Observable";
import {ChatService} from "../../../@core/data/chat.service";
import {Conversation} from "../../../models/conversation.model";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatroomComponent implements OnInit {
  feed: Observable<ChatMessage[]>;
  selectedConversation: Conversation;
  email: string = localStorage.getItem('email');
  conversationName = '';
  memberList = '';
  picture = '';
  imageUrl:string[] = [];
  constructor(private chat: ChatService) {

  }

  ngOnInit() {}

  setConversationId(conversation) {
    this.selectedConversation = conversation;
    this.feed = this.chat.getMessages(conversation.appyID).valueChanges();
    this.setConversastionHeader(conversation)
  }

  setConversastionHeader(conversation: Conversation) {
    
    if(conversation.isGroupChat) {
      this.conversationName = conversation.name;
      this.memberList = conversation.participantsCS.replace(',', ', ');
      this.picture = conversation.iconURL?conversation.iconURL:'https://s3-ap-southeast-2.amazonaws.com/nuhabit-dementiaapp001-gmail.com/5b7ceca03f2235f614d83e98_default.png';
      this.imageUrl = conversation.imageUrl

    }else {
      const participants = conversation.participantsCS.trim().split(',');
      const emailList = participants.filter( (data) => this.email != data);
      this.conversationName = emailList[0];
      this.memberList = '';
      this.imageUrl = [];
    }
  }

  goToEditConversation(){

  }

  goToDeleteConversation(){
    this.chat.deleteConversation('appyID',this.selectedConversation.appyID,this.email);
    this.selectedConversation = null;
    this.feed = null;
  }
}
