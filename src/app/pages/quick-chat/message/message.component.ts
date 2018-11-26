import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { ChatMessage } from '../../../models/chat-message.model';
import { Conversation } from '../../../models/conversation.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() chatMessage: ChatMessage;
  userEmail: string;
  userName: string;
  messageContent: string;
  imageUrl: string;
  time: string;
  isOwnMessage: boolean = localStorage.getItem('email') === this.userEmail;
  ownEmail: string;

  constructor(public datepipe: DatePipe){

  }

  ngOnInit(chatMessage = this.chatMessage) {
    this.messageContent = chatMessage.text;
    this.time =  this.datepipe.transform(new Date(chatMessage.time), 'MMM d, h:mm a');
    this.userEmail = chatMessage.name;
    this.userName = chatMessage.name;
    this.imageUrl = chatMessage.imageUrl;
    this.isOwnMessage = localStorage.getItem('email') === this.userEmail;
  }
}
