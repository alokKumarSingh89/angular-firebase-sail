import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../../globals';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '../../pages.service';
import { LoaderService } from '../../../loader.service';
@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>Preview Url</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    {{ selectedImageId }}
      <div class = "row" style="margin: 10px 10px;">
        <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
        <div class="row">
          <div class="col-md-8">
            Upload Image  :
            <input type="file" name="avatar" id="fileToUpload" formControlName="file1" (change)="fileEvent($event)">
          </div>
          <div class="col-md-4">
            <input type="submit" value="Upload" name="submit" class="btn btn-success">
          </div>
          </div>
        </form>
      </div>  
      <div class="row">
        <div  *ngFor="let url of previewURLs"class="col-md-2">
          <div class="img-background" [ngClass]="{'selected-img':selectedImageId == url.id }"> <img src="{{url.url}}" class="img-responsive" width="95px" (click)="onImageClick(url)"> </div>
        </div>
      </div>  
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close(imageObject)">Select</button>
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
export class ThumbnailModalComponent {

  modalHeader: string;
  previewURLs: any;
  selectedImageId: any;
  imageObject;
  filedata = "";
  uploadForm;
  errorMsg = "";

  Name: string;
  public myFile: File; /* property of File type */

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }



  constructor(public activeModal: NgbActiveModal, private _globals: Globals, private _pagesService: PagesService, private loaderService: LoaderService) {
    var token = localStorage.getItem('access_token');

    this.uploadForm = new FormGroup({
      file1: new FormControl()
    });
  }

  /* Now send your form using FormData */
  onSubmit(): void {
    this.errorMsg = "";
    let _formData = new FormData();
    _formData.append("uploadFile", this.filedata);
    let body = _formData;

    this._pagesService.uploadImage(_formData).subscribe(
      data => {
        // this.previewURLs.insert(0, data);
        this._pagesService.getImages().subscribe(
          data => {
            this.previewURLs = data;
            this.loaderService.display(false);
          },
          error => {
            this.loaderService.display(false);
            this.errorMsg = error.error.message;
          }
        );
      },
      error => {

      }
    );

  }

  closeModal() {
    this.activeModal.close();
  }

  onImageClick(image) {
    this.selectedImageId = image.id;
    this.imageObject = image;

  }


}
