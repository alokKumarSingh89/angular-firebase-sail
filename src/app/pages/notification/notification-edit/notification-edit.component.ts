import { Component, OnInit } from '@angular/core';
// import { notificationModel } from './../../event.model';
import { PagesService } from '../../pages.service';
import { NgbModal ,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../events/modal/modal.component';
import { ThumbnailModalComponent } from '../../events/modal/thumbnailModal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute ,Params, Router } from '@angular/router';

@Component({
  selector: 'notification-edit',
  templateUrl: './notification-edit.component.html',
  styleUrls:['./notification-edit.component.scss'],
})
export class NotificationEditComponent implements OnInit {
    
    public notificationModel:any = {};
    public images:any;
    public nodeId;
    // public activeModal;
    public activeModal: NgbModalRef;
    private activeThumnailModal: NgbModalRef;
    public thumbnailErrMsg = "";
    public previewUrlErrMsg = "";
    public pushPreviewUrlErrMsg = "";
    public pushThumbnailErrMsg = "";
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
    
    constructor(private _pagesService: PagesService,private _modalService: NgbModal,private _toasterService: ToasterService,protected router: Router,private activatedRoute : ActivatedRoute) {
          
    }
    ngOnInit() {
        
         this.activatedRoute.params.subscribe(params => {
           this.nodeId  = params['id'];
         });
       
        if(this.nodeId){
            let postObj:any = {}
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
                    if(results != undefined){
                        this.notificationModel.previewURL = results.url;
                        this.previewUrlErrMsg = "";
                    }else{
                        this.previewUrlErrMsg = "required";
                    }
    
          }, (reason) => {

            this.previewUrlErrMsg = "required";
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
            }else{
                this.thumbnailErrMsg = "required";
            }

          }, (reason) => {

            this.thumbnailErrMsg = "required";
          });
    }


    pushPreviewUrlModal() {
        this.activeModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    
        this.activeModal.componentInstance.modalHeader = 'Large Modal';
        this.activeModal.componentInstance.previewURLs = this.images;

        this.activeModal.result.then((results) => {
                    if(results != undefined){
                        this.notificationModel.pushPreviewURL = results.url;
                        this.pushPreviewUrlErrMsg = "";
                    }else{
                        this.pushPreviewUrlErrMsg = "required";
                    }
    
          }, (reason) => {

            this.pushPreviewUrlErrMsg = "required";
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
            }else{
                this.pushThumbnailErrMsg = "required";
            }

          }, (reason) => {

            this.pushThumbnailErrMsg = "required";
          });
    }

    submitForm(){
        if(this.isNewUpdate){
            let postObj:any = {}
            postObj.nodeType = "Updates";
            postObj.fields = this.notificationModel;
            this._pagesService.saveNode(postObj).subscribe(
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
        }else{
            let postObj:any = {}
            postObj.nodeType = "Updates";
            postObj.fields = this.notificationModel;
            postObj.id = this.notificationModel.id;
            this.content ="Updates stored successfully."
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
}