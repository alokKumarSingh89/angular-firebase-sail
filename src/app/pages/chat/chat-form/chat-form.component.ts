import {Component, Input, OnInit} from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {PagesService} from "../../pages.service";
import {ImageUploadModalComponent} from "../image-upload-modal/image-upload-modal.component";
import { ModalComponent } from '../../events/modal/modal.component';
import {Conversation} from "../../../models/conversation.model";

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
  message: string;
  @Input() selectedConversation: Conversation;
  participants: string[]= [];
  public activeModal: NgbModalRef;
  public eventModel: any = {};
  public images: any;
  public previewUrlErrMsg = '';
  public imagesArray;

  constructor(private chatService: ChatService, private modalService: NgbModal,private _pagesService: PagesService) {}
  email: string = localStorage.getItem('email');

    ngOnInit() {
      this._pagesService.getImages().subscribe(
        data => {
          this.imagesArray = data;
        },
        error => {
  
        }
      );
  }

  send() {
    this.participants.push(this.email)
    this.chatService.sendMessage(this.message, '', '', this.selectedConversation);
    this.message = '';
    this.participants = [];
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

  previewUploadImageModal() {
    this.activeModal = this.modalService.open(ImageUploadModalComponent, {size: 'lg', container: 'nb-layout'});
    this.activeModal.componentInstance.conversation = this.selectedConversation;

  }
  previewUrlModal() {
    this.activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    this.activeModal.componentInstance.modalHeader = 'Large Modal';
    this.activeModal.componentInstance.previewURLs = this.imagesArray;
    this.activeModal.result.then((results) => {
      if (results != undefined) {
        this.chatService.sendMessage('', '', results.url, this.selectedConversation);
      }
    }, (reason) => {
      console.log('reason', reason)
    });
  }

}
