import { Component, OnInit } from '@angular/core';
// import { updatesModel } from './../../event.model';
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

@Component({
  selector: 'dementia-edit',
  templateUrl: './dementia-edit.component.html',
  styleUrls:['./dementia-edit.component.scss'],
})
export class DementiaEditComponent implements OnInit {
    
    public updatesModel:any = {};
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
    content = `Dementia Added Successfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = true;
    
    constructor(private _pagesService: PagesService,private _modalService: NgbModal,private _toasterService: ToasterService,protected router: Router,private activatedRoute : ActivatedRoute,private _globals:Globals,private loaderService: LoaderService) {
       
    }

    // ngAfterViewInit() 
    ngOnInit() {

        this.loaderService.display(true);
         this.activatedRoute.params.subscribe(params => {
           this.nodeId  = params['id'];
         });
       
        if(this.nodeId){
            let postObj:any = {}
            postObj.nodeType = 'Dementia';
            postObj.id = this.nodeId;
            this._pagesService.getNode(postObj).subscribe(
                data => {
                    this.updatesModel = data[0].fields;
                    this.updatesModel.id = data[0].id;
                    this.updatesModel.updateID = data[0].updateID;
                    this.isNewUpdate = false;
                    this.loaderService.display(false);
                },
                error => {

                }
            );
        }else{
          
            this.loaderService.display(false);
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
                        this.updatesModel.previewURL = results.url;
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
        
        if(this.updatesModel.thumbnailURL != undefined){
            this.activeThumnailModal.componentInstance.selectedImageId = this.updatesModel.thumbnailURL.id;
        }
        
        this.activeThumnailModal.result.then((results) => {
            if(results != undefined){
                this.updatesModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
            }else{
                this.thumbnailErrMsg = "required";
            }

          }, (reason) => {

            this.thumbnailErrMsg = "required";
          });
    }

    submitForm(){

        this.loaderService.display(true);
        if(this.isNewUpdate){
            let postObj:any = {}
            postObj.nodeType = "Dementia";
            postObj.fields = this.updatesModel;
            postObj.updateID  = "DEMENTIA_" + this._globals.getDateMilliSecond();
            this._pagesService.saveNode(postObj).subscribe(
                data => {
                    this.loaderService.display(false);
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/dementia'])
                },
                error => {
                    this.loaderService.display(false);
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                }
            );
        }else{
            let postObj:any = {}
            postObj.nodeType = "Dementia";
            postObj.fields = this.updatesModel;
            postObj.id = this.updatesModel.id;
            this.content ="Dementia stored successfully."
            this._pagesService.updateNode(postObj).subscribe(
                data => {
                    // this.loaderService.display(false);
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/dementia'])
                },
                error => {
                    this.loaderService.display(false);
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                }
            );
        }
      

    }
}