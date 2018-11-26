import { Component , Renderer2 , OnInit} from '@angular/core';

import { PagesService } from '../../pages.service';
import { NgbModal ,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../events/modal/modal.component';
import { ThumbnailModalComponent } from '../../events/modal/thumbnailModal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute ,Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-campaign',
  templateUrl: './campaign-edit.component.html',
  styleUrls:['./campaign-edit.component.scss'],
})   

export class CampaignEditComponent implements OnInit {

    public notificationModel:any = {};
    public images:any;
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
    public data = [];
    constructor(private _pagesService: PagesService,private _modalService: NgbModal,private _toasterService: ToasterService,protected router: Router,private activatedRoute : ActivatedRoute , public _activeModal: NgbActiveModal,private renderer: Renderer2,private loaderService: LoaderService) {
          
    }
       
    ngOnInit() {
        
         this.activatedRoute.params.subscribe(params => {
           this.nodeId  = params['id'];
         });
       
        if(this.nodeId){
          this.loaderService.display(true);
            let postObj:any = {}
            postObj.nodeType = 'Campaigns';
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

        this.getCampaignsList();
        
    }

    public getCampaignsList(){
        this._pagesService.getNodes("Campaigns").subscribe(
          data => {
            this.data = [];
            let tempData: any = {};
            for (var key in data) {
              tempData = data[key].fields
              tempData.id = data[key].id;
              this.data.push(tempData);
            }
            // this.onChangeTable(this.config);
            this.loaderService.display(false);
          },
          error => {
            this.loaderService.display(false);
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
                    if(results != undefined){
                        this.notificationModel.previewURL = results.url;
                        this.previewUrlErrMsg = "";
                        this.renderer.addClass(document.body, 'modal-open');
                    }else{
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
        
        if(this.notificationModel.thumbnailURL != undefined){
            this.activeThumnailModal.componentInstance.selectedImageId = this.notificationModel.thumbnailURL.id;
        }
        
        this.activeThumnailModal.result.then((results) => {
            if(results != undefined){
                this.notificationModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
                this.renderer.addClass(document.body, 'modal-open');
                
            }else{
                this.thumbnailErrMsg = "required";
                this.renderer.addClass(document.body, 'modal-open');
            }

          }, (reason) => {

            this.thumbnailErrMsg = "required";
            this.renderer.addClass(document.body, 'modal-open');
          });
    }

    submitForm(form: any){
      if(this.isNewUpdate){
        let postObj:any = {};
        postObj.nodeType = "Campaigns";
        postObj.fields = this.notificationModel;
        this.loaderService.display(true);
        this._pagesService.saveNode(postObj).subscribe(
          data => {
              this.title = "Campaign Update";
              this.content = "Campaign added successfully."
              this.showToast(this.type, this.title, this.content);
              this.router.navigate(['/pages/campaign'])
            //   this.getEventList();
            this.notificationModel = "";
            form.resetForm();
            this.loaderService.display(false);
            this.isPushchecked = true;
            this.isEmailchecked = true;
            this.isSmschecked = true;
            this.pushCheck(true);
            this.emailCheck(true);
            this.smsCheck(true);
          },
          error => {
              this.type = 'error';
              this.title = "Error";
              this.content = "Something went wrong";
              this.loaderService.display(false);
              this.showToast(this.type, this.title, this.content);
          }
      );
      }else{
        let postObj:any = {};
        postObj.nodeType = "Campaigns";
        postObj.fields = this.notificationModel;
        postObj.id = this.notificationModel.id;
        this.loaderService.display(true);
        this._pagesService.updateNode(postObj).subscribe(
          data => {
              this.title = "Campaign Update";
              this.content = "Campaign updated successfully."
              this.showToast(this.type, this.title, this.content);
               this.router.navigate(['/pages/campaign'])
            //   this.getEventList();
            this.notificationModel = "";
            form.resetForm();
            this.loaderService.display(false);
            this.isPushchecked = true;
            this.isEmailchecked = true;
            this.isSmschecked = true;
            this.pushCheck(true);
            this.emailCheck(true);
            this.smsCheck(true);
          },
          error => {
              this.type = 'error';
              this.title = "Error";
              this.content = "Something went wrong";
              this.loaderService.display(false);
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
                  if(results != undefined){
                      this.notificationModel.pushPreviewURL = results.url;
                      this.pushPreviewUrlErrMsg = "";
                      this.renderer.addClass(document.body, 'modal-open');
                  }else{
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
      
      if(this.notificationModel.thumbnailURL != undefined){
          this.activeThumnailModal.componentInstance.selectedImageId = this.notificationModel.thumbnailURL.id;
      }
      
      this.activeThumnailModal.result.then((results) => {
          if(results != undefined){
              this.notificationModel.pushThumbnailURL = results.url;
              this.pushThumbnailErrMsg = "";
              this.renderer.addClass(document.body, 'modal-open');
          }else{
              this.pushThumbnailErrMsg = "required";
              this.renderer.addClass(document.body, 'modal-open');
          }

        }, (reason) => {

          this.pushThumbnailErrMsg = "required";
          this.renderer.addClass(document.body, 'modal-open');
        });
  }

  pushCheck(event){
    if(!this.isPushchecked){
      this.notificationModel.pushTitle = "";
      this.notificationModel.pushShortDesc = "";
      this.notificationModel.pushLongDesc = "";
      this.notificationModel.pushLongDesc = "";
      this.notificationModel.pushImageThumn = "";
      this.notificationModel.pushTargetGroups = "";  
      this.notificationModel.pushTriggerTime = "";
      this.notificationModel.pushPreviewURL = "";
      this.notificationModel.pushThumbnailURL  = "";
    }
  }

  smsCheck(event){
    if(!this.isSmschecked){
      this.notificationModel.smsText = "";
      this.notificationModel.smsTargetGroups = "";
      this.notificationModel.smsTriggerTime = "";
    }
  }

  emailCheck (event){
    if(!this.isEmailchecked){
      this.notificationModel.emailSubject = "";
      this.notificationModel.emailBody = "";
      this.notificationModel.emailTargetGroups = "";
      this.notificationModel.emailTriggerTime = "";
    }
  }
}

