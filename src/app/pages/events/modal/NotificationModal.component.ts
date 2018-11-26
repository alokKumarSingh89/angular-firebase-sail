import { Component, Renderer2 } from '@angular/core';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThumbnailModalComponent } from './thumbnailModal.component';
import '../event-edit/ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
'@angular/forms';
import { LoaderService } from '../../../loader.service';
@Component({
    selector: 'ngx-modal',
    template: `
    <div class="modal-header">
      <span>Send Notification</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="overflow:hidden;">

    

    <form (ngSubmit)="submitForm()" #form="ngForm" autocomplete="nope">

    <div  class="row">
        <div class="col-md-12 form-group validation-checkboxes">
         <label> Select Notification Mode(s): </label><br>
         <nb-checkbox class="col-sm-4"  name="isPushchecked" [(ngModel)]="isPushchecked" (change)="pushCheck($event)">Push notification</nb-checkbox><br>  

          <nb-checkbox status="success" 
          class="col-sm-4"  name="isEmailchecked" [(ngModel)]="isEmailchecked" (change)="emailCheck($event)">Email</nb-checkbox> <br>

          <nb-checkbox class="col-sm-4"  name="isSmschecked" [(ngModel)]="isSmschecked" (change)="smsCheck($event)">SMS</nb-checkbox><br>
        </div>
    </div>
    <div *ngIf="isPushchecked">
      <nb-card>
        <nb-card-header>Push Notification</nb-card-header>
        <nb-card-body>
      
        <div class="row">
          <div class="form-group col-md-6">
                  <label for="input-pushTitle" class="sr-only">Push Message Title</label>
                  <input name="pushTitle" [(ngModel)]="notificationModel.pushTitle" id="input-email"  class="form-control" placeholder="Push Message Title"
                      #pushTitle="ngModel" [class.form-control-danger]="pushTitle.invalid && pushTitle.touched" autofocus >
                  <small class="form-text error" *ngIf="pushTitle.invalid && pushTitle.touched && pushTitle.errors?.required">
                      Push Message Title is required!
                  </small>
              </div>
          
              <div class="form-group col-md-6">
                  <label for="input-pushShortDesc" class="sr-only">Push message short description</label>
                  <input name="pushShortDesc" [(ngModel)]="notificationModel.pushShortDesc" type="text" id="input-pushShortDesc" class="form-control" placeholder="Push message short description"
                      #pushShortDesc="ngModel" [class.form-control-danger]="pushShortDesc.invalid && pushShortDesc.touched" required>
                  <small class="form-text error" *ngIf="pushShortDesc.invalid && pushShortDesc.touched && pushShortDesc.errors?.required">
                  Push message short description is required!
                  </small>
              </div>
            </div>

            <div class="form-group">
                <label>Push Long Description HTML</label>
                <ckeditor [config]="{ extraPlugins: 'divarea', height: '320' } "  [(ngModel)]="notificationModel.pushLongDesc" name="pushLongDesc" id="input-pushLongDesc"  #pushLongDesc="ngModel"  [class.form-control-danger]="pushLongDesc.invalid && pushLongDesc.touched"></ckeditor>
                <small class="form-text error" *ngIf="pushLongDesc.invalid && pushLongDesc.touched && pushLongDesc.errors?.required">
                        Push Long Description is required!
                </small>

            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="btn btn-success" (click)="pushPreviewUrlModal()" style="margin:15px 0px;">Select Push Preview Image</div>
                    <img src={{notificationModel.pushPreviewURL}}  width="100px;"/>
                    <p class="form-text error" *ngIf="pushPreviewUrlErrMsg" style="margin:-10px 15px;">
                            Preview Push image is required!
                    </p>
                </div>
            </div>
          
            <div class="row">
                <div class="col-md-12">
                    <div class="btn btn-success" (click)="pushThumbnailURLModal()" style="margin:15px 0px;">Select Push Thumbnail Image</div>
                    <img src={{notificationModel.pushThumbnailURL}}  width="100px;"/>
                    <span class="form-text error" *ngIf="pushThumbnailErrMsg" style="margin:-10px 15px; ;">
                            Thumnail push image is required!
                    </span>
                </div>
            </div>

          <div class="row">
              <div class="form-group col-md-6" >
                      <label>Send to targets</label>
                  <select class="form-control"   name="pushTargetGroups" [(ngModel)]="notificationModel.pushTargetGroups" type="text" id="input-PushTargetGroups" class="form-control" >
                        <option>All users</option>
                        <option>All iOS users</option>
                        <option>All Android users</option>
                      </select>
              </div>
          </div>

          <div class="form-group">
              <label for="input-pushTriggerTime" class="sr-only">Push Trigger Time</label>
              <input [owlDateTime]="dt1" [owlDateTimeTrigger]="dt1" placeholder="Push Trigger Time" class="form-control"  name="pushTriggerTime" [(ngModel)]="notificationModel.pushTriggerTime"  id="input-pushTriggerTime">
              <owl-date-time #dt1></owl-date-time>

              <!-- <small class="form-text error" *ngIf="pushTriggerTime.invalid && pushTriggerTime.touched && pushTriggerTime.errors?.required">
              Push Trigger Time is required!
              </small> -->
          </div>
        </nb-card-body>  
        </nb-card>
    </div>  

    <div *ngIf="isEmailchecked">
    <nb-card>
      <nb-card-header>Email</nb-card-header>
      <nb-card-body>
  
          <div class="row">
              <div class="form-group col-md-6">
                      <label for="input-email" class="sr-only">Email Subject</label>
                      <input name="emailSubject" [(ngModel)]="notificationModel.emailSubject" id="input-email"  class="form-control" placeholder="Email Subject"
                          #emailSubject="ngModel" [class.form-control-danger]="emailSubject.invalid && emailSubject.touched" autofocus >
                      <small class="form-text error" *ngIf="emailSubject.invalid && emailSubject.touched && emailSubject.errors?.required">
                          Name is required!
                      </small>
              </div>
          </div>
              
          <div class="form-group">
            <label>Email Body</label>
            <ckeditor [config]="{ extraPlugins: 'divarea', height: '320' } "  [(ngModel)]="notificationModel.emailBody" name="emailBody" id="input-emailBody"  #emailBody ="ngModel"  [class.form-control-danger]="emailBody.invalid && emailBody.touched"></ckeditor>
            <small class="form-text error" *ngIf="emailBody.invalid && emailBody.touched && emailBody.errors?.required">
                    Long Description is required!
            </small>
          </div>
          <div class="alert alert-danger" role="alert">
          Available email credits <strong>:0000</strong> <a href="#" class="alert-link">Buy email credits</a>
          </div>
          <div class="row">
              <div class="form-group col-md-6" >
                      <label>Send to targets</label>
                  <select class="form-control"   name="emailTargetGroups" [(ngModel)]="notificationModel.emailTargetGroups" type="text" id="input-emailTargetGroups" class="form-control" >
                        <option>All users</option>
                        <option>All iOS users</option>
                        <option>All Android users</option>
                      </select>
              </div>
          </div>

          <div class="form-group">
              <label for="input-emailTriggerTime" class="sr-only">Email Trigger Time</label>
              <input [owlDateTime]="dt2" [owlDateTimeTrigger]="dt2" placeholder="Email Trigger Time" class="form-control"  name="emailTriggerTime" [(ngModel)]="notificationModel.emailTriggerTime"  id="input-emailTriggerTime">
              <owl-date-time #dt2></owl-date-time>

              <!-- <small class="form-text error" *ngIf="emailTriggerTime.invalid && emailTriggerTime.touched && emailTriggerTime.errors?.required">
              Email Trigger Time is required!
              </small> -->
          </div>
          </nb-card-body>  
        </nb-card>
    </div>

    <div *ngIf="isSmschecked">
    <nb-card>
      <nb-card-header>SMS</nb-card-header>
      <nb-card-body>

        <div class="row">
            <div class="form-group col-md-6">
                    <label for="input-email" class="sr-only">Sms Text</label>
                    <input name="smsText" [(ngModel)]="notificationModel.smsText" id="input-smsText"  class="form-control" placeholder="Sms Text"
                        #smsText="ngModel" [class.form-control-danger]="smsText.invalid && smsText.touched" autofocus >
                    <small class="form-text error" *ngIf="smsText.invalid && smsText.touched && smsText.errors?.required">
                            sms text required!
                    </small>
            </div>
        </div>
        <div class="alert alert-danger" role="alert">
        Available SMS credits <strong>:0000</strong> <a href="#" class="alert-link">Buy SMS credits</a></div>
        <div class="row">
          <div class="form-group col-md-6" >
                  <label>Send to targets</label>
              <select class="form-control"   name="smsTargetGroups" [(ngModel)]="notificationModel.smsTargetGroups" type="text" id="input-smsTargetGroups" class="form-control" >
                      <option>All users</option>
                      <option>All iOS users</option>
                      <option>All Android users</option>
                  </select>
          </div>
        </div>
          
        <div class="form-group">
            <label for="input-smsTriggerTime" class="sr-only">SMS Trigger Time</label>
            <input [owlDateTime]="dt3" [owlDateTimeTrigger]="dt3" placeholder="SMS Trigger Time" class="form-control"  name="smsTriggerTime" [(ngModel)]="notificationModel.smsTriggerTime"  id="input-smsTriggerTime">
            <owl-date-time #dt3></owl-date-time>

            <!-- <small class="form-text error" *ngIf="smsTriggerTime.invalid && smsTriggerTime.touched && smsTriggerTime.errors?.required">
            SMS Trigger Time is required!
            </small> -->
        </div>
        </nb-card-body>  
        </nb-card>
    </div>

</form>


    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" [disabled]="!form.valid" (click)="_activeModal.close(notificationModel)">Save Notification</button>
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
      overflow:auto !important;
  }
    
  /* Important part */
  .modal-dialog{
      overflow-y: initial !important
  }
  .modal-body{
      // overflow-y: auto;
  }
  .modal{
    overflow: auto !important;
  }
  .cdk-overlay-container {
    position: fixed;
    z-index: 15000;
  }
    </style>
  `,
})
export class NotificationModalComponent {

    public notificationModel: any = {};
    public images: any;
    public nodeId;
    // public activeModal;
    public activeModal: NgbModalRef;
    private activeThumnailModal: NgbModalRef;
    public thumbnailErrMsg = "";
    public previewUrlErrMsg = "";
    toastConfig: ToasterConfig;
    position = 'toast-top-right';
    animationType = 'fade';
    title = 'Updates!';
    content = `Updates Added Sucessfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = true;
    public pushPreviewUrlErrMsg = "";
    public pushThumbnailErrMsg = "";
    public isPushchecked = true;
    public isSmschecked = true;
    public isEmailchecked = true;

    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, public _activeModal: NgbActiveModal, private renderer: Renderer2, private loaderService: LoaderService) {

    }
    ngOnInit() {

        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
        });

        if (this.nodeId) {
            let postObj: any = {}
            postObj.nodeType = 'Updates';
            postObj.id = this.nodeId;
            this._pagesService.getNode(postObj).subscribe(
                data => {
                    this.notificationModel = data[0].fields;
                    this.notificationModel.id = data[0].id;
                    this.isNewUpdate = false;
                },
                error => {

                }
            );
        }


        this._pagesService.getImages().subscribe(
            data => {
                this.images = data;
            },
            error => {

            }
        );

    }


    private showToast(type: string, title: string, body: string) {
        this.toastConfig = new ToasterConfig({
            positionClass: this.position,
            timeout: this.timeout,
            newestOnTop: this.isNewestOnTop,
            tapToDismiss: this.isHideOnClick,
            preventDuplicates: this.isDuplicatesPrevented,
            animation: this.animationType,
            limit: this.toastsLimit,
        });
        const toast: Toast = {
            type: type,
            title: title,
            body: body,
            timeout: this.timeout,
            showCloseButton: this.isCloseButton,
            bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this._toasterService.popAsync(toast);
    }

    clearToasts() {
        this._toasterService.clear();
    }

    previewUrlModal() {
        this.activeModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeModal.componentInstance.modalHeader = 'Large Modal';
        this.activeModal.componentInstance.previewURLs = this.images;

        this.activeModal.result.then((results) => {
            if (results != undefined) {
                this.notificationModel.previewURL = results.url;
                this.previewUrlErrMsg = "";
                this.renderer.addClass(document.body, 'modal-open');
            } else {
                this.previewUrlErrMsg = "required";
                this.renderer.addClass(document.body, 'modal-open');
            }

        }, (reason) => {

            this.previewUrlErrMsg = "required";
            this.renderer.addClass(document.body, 'modal-open');
        });
    }


    thumbnailURLModal() {
        this.activeThumnailModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeThumnailModal.componentInstance.modalHeader = 'Large Modal';
        this.activeThumnailModal.componentInstance.previewURLs = this.images;

        if (this.notificationModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.notificationModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {
            if (results != undefined) {
                this.notificationModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
                this.renderer.addClass(document.body, 'modal-open');

            } else {
                this.thumbnailErrMsg = "required";
                this.renderer.addClass(document.body, 'modal-open');
            }

        }, (reason) => {

            this.thumbnailErrMsg = "required";
            this.renderer.addClass(document.body, 'modal-open');
        });
    }

    submitForm() {
        if (this.isNewUpdate) {
            let postObj: any = {}
            this.loaderService.display(true);
            postObj.nodeType = "Updates";
            postObj.fields = this.notificationModel;
            this._pagesService.saveNode(postObj).subscribe(
                data => {
                    this.loaderService.display(false);
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/notifications'])
                },
                error => {
                    this.loaderService.display(false);
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                }
            );
        } else {
            let postObj: any = {}
            postObj.nodeType = "Updates";
            postObj.fields = this.notificationModel;
            postObj.id = this.notificationModel.id;
            this.content = "Updates stored successfully."
            this._pagesService.updateNode(postObj).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/notifications'])
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                }
            );
        }
    }

    closeModal() {
        this._activeModal.close();
    }

    pushPreviewUrlModal() {
        this.activeModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeModal.componentInstance.modalHeader = 'Large Modal';
        this.activeModal.componentInstance.previewURLs = this.images;

        this.activeModal.result.then((results) => {
            if (results != undefined) {
                this.notificationModel.pushPreviewURL = results.url;
                this.pushPreviewUrlErrMsg = "";
                this.renderer.addClass(document.body, 'modal-open');
            } else {
                this.pushPreviewUrlErrMsg = "required";
                this.renderer.addClass(document.body, 'modal-open');
            }

        }, (reason) => {

            this.pushPreviewUrlErrMsg = "required";
            this.renderer.addClass(document.body, 'modal-open');
        });
    }


    pushThumbnailURLModal() {
        this.activeThumnailModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeThumnailModal.componentInstance.modalHeader = 'Large Modal';
        this.activeThumnailModal.componentInstance.previewURLs = this.images;

        if (this.notificationModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.notificationModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {
            if (results != undefined) {
                this.notificationModel.pushThumbnailURL = results.url;
                this.pushThumbnailErrMsg = "";
                this.renderer.addClass(document.body, 'modal-open');
            } else {
                this.pushThumbnailErrMsg = "required";
                this.renderer.addClass(document.body, 'modal-open');
            }

        }, (reason) => {

            this.pushThumbnailErrMsg = "required";
            this.renderer.addClass(document.body, 'modal-open');
        });
    }

    pushCheck(event) {
        if (!this.isPushchecked) {
            this.notificationModel.pushTitle = "";
            this.notificationModel.pushShortDesc = "";
            this.notificationModel.pushLongDesc = "";
            this.notificationModel.pushLongDesc = "";
            this.notificationModel.pushImageThumn = "";
            this.notificationModel.pushTargetGroups = "";
            this.notificationModel.pushTriggerTime = "";
            this.notificationModel.pushPreviewURL = "";
            this.notificationModel.pushThumbnailURL = "";
        }
    }

    smsCheck(event) {
        if (!this.isSmschecked) {
            this.notificationModel.smsText = "";
            this.notificationModel.smsTargetGroups = "";
            this.notificationModel.smsTriggerTime = "";
        }
    }

    emailCheck(event) {
        if (!this.isEmailchecked) {
            this.notificationModel.emailSubject = "";
            this.notificationModel.emailBody = "";
            this.notificationModel.emailTargetGroups = "";
            this.notificationModel.emailTriggerTime = "";
        }
    }


}