import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatService} from "../../../@core/data/chat.service";
import {Conversation} from "../../../models/conversation.model";

@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './image-upload-modal.component.html',
  styleUrls: ['./image-upload-modal.component.scss']
})
export class ImageUploadModalComponent implements OnInit {

  modalHeader: string;
  imageUrl: string;
  @Input() conversation: Conversation;

  constructor(public activeModal: NgbActiveModal, private chatService: ChatService) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  sendImage() {
    this.closeModal();
    this.chatService.sendMessage('', '', this.imageUrl, this.conversation);
  }

}
