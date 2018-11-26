import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../../globals';
import { PagesService } from '../../pages.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>Delete Alert</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="height:100px;">
        Are you sure you want to delete record? 
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('Yes')">Delete</button>
    </div>
    <style>
    .selected-img{
      background: aquamarine;
      padding: 3px
    }
    .img-background{
      curson:pointer;
      padding:5px;
      width: 105px;
    }
    .modal{
      display: block !important; /* I added this to see the modal, you don't need this */
  }
  
  /* Important part */
  .modal-dialog{
      overflow-y: initial !important
  }
  .modal-body{
      height: 250px;
      overflow-y: auto;
  }
    </style>
  `,
})
export class DeleteModalComponent {

  modalHeader: string;
  previewURLs: any;
  selectedImageId:"";
  imageObject;
  filedata = "";
  uploadForm;

  Name:string; 
  public myFile:File; /* property of File type */

  fileEvent(e){
		this.filedata = e.target.files[0];
	}

  constructor(public activeModal: NgbActiveModal,private _globals:Globals,private _pagesService: PagesService) { 
   
  }

  closeModal() {
    this.activeModal.close();
  }

  
}
