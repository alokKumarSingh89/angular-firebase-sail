import { Component, Renderer2 } from '@angular/core';
import { PagesService } from '../pages/pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
'@angular/forms';
import { LoaderService } from '../loader.service';
@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>Change Status</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="overflow:hidden;">

        <form (ngSubmit)="submitForm()" #form="ngForm" autocomplete="nope">
        <div class="row">
          <div class="form-group col-md-6" >
                  <label>Status</label>
              <select class="form-control"   name="apprStatus" [(ngModel)]="visitorModel.apprStatus" id="input-emailTargetGroups" class="form-control" >
                    <option *ngFor="let vStatus of visitorStatus">{{vStatus.status}}</option>

                  </select>
            </div>
          </div>

        </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" [disabled]="!form.valid" (click)="_activeModal.close(visitorModel)">Change Status </button>
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
export class ChangeStatusModalComponent {

  public notificationModel: any = {};
  public visitorModel: any = {};
  public visitorModald: any = {};
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
  public visitorStatus = [{ "status": "Waiting Arrival" },
  { "status": "Arrived" },
  { "status": "Initiate Approval" },
  { "status": "Approved" }];

  constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, public _activeModal: NgbActiveModal, private renderer: Renderer2, private loaderService: LoaderService) {
    console.log("edit", this.visitorModel);
  }
  ngOnInit() {

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