import {Component, OnInit, OnChanges, Input, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { Observable } from 'rxjs/Observable';
import { ChatMessage } from '../../../models/chat-message.model';
import {Conversation} from '../../../models/conversation.model';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnChanges, AfterViewChecked {


  constructor(private chat: ChatService) { }

  @ViewChild('scroller') private feedContainer: ElementRef;
  email: string = localStorage.getItem('email');
  @Input() feed: Observable<ChatMessage[]>;
  @Input() selectedConversation: Conversation;

  ngOnInit() {
    if(this.selectedConversation) {
      this.feed = this.chat.getMessages(this.selectedConversation.appyID).valueChanges();
    }
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop
      = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    if(this.selectedConversation) {
      this.feed = this.chat.getMessages(this.selectedConversation.appyID).valueChanges();
    }
  }
}
