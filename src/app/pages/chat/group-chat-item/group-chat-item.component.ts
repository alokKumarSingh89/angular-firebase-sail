import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Conversation} from "../../../models/conversation.model";
import {ChatService} from "../../../@core/data/chat.service";

@Component({
  selector: 'app-group-chat-item',
  templateUrl: './group-chat-item.component.html',
  styleUrls: ['./group-chat-item.component.scss']
})
export class GroupChatItemComponent implements OnInit {

  @Input() conversation: Conversation;
  @Output() getConversation: EventEmitter<Conversation> = new EventEmitter();

  constructor(private chat: ChatService) { }

  ngOnInit() {
  }

  setSelectedConversation() {
    this.getConversation.emit(this.conversation);
  }
}
