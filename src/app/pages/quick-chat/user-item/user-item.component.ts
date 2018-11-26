import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import {Conversation} from '../../../models/conversation.model';
@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @Input() user: any = {};
  @Output() emailId: EventEmitter<string> = new EventEmitter();
  isSelectedId: string;
  constructor(private chat: ChatService) { }
  isSelected: boolean = false;

  ngOnInit() {
    console.log(this.user);  
  }

  setSelectedEmailId() {
    this.isSelectedId = this.user.createdBy;
    this.emailId.emit(this.user.createdBy);
    this.isSelected = this.checkIsSelected();
}

  checkIsSelected(): boolean{
    let isSelect = false;
    if(this.isSelectedId != undefined && this.user.createdBy != undefined) {
      isSelect = this.isSelectedId == this.user.createdBy;
    }
    return isSelect;
  }

}
