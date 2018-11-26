import { Component, OnInit, ViewChild } from '@angular/core';
// import { visitorModel } from './../../event.model';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../events/modal/modal.component';
import { ThumbnailModalComponent } from '../../events/modal/thumbnailModal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { Globals } from '../../../globals';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
    selector: 'visitor-edit',
    templateUrl: './visitor-edit.component.html',
    styleUrls: ['./visitor-edit.component.scss'],
})
export class VisitorEditComponent implements OnInit {

    public visitorModel: any = {};
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
    title = 'Visitor!';
    content = `Visitor Added Sucessfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = true;
    public visitorStatus = [{ "status": "Waiting Arrival" },
    { "status": "Arrived" },
    { "status": "Initiate Approval" },
    { "status": "Approved" }];
    public userFirstName = [];
    public userLastName = [];
    public doorNoList = [];
    public filedata = '';
    // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private loaderService: LoaderService, private _globals: Globals) {

    }
    ngOnInit() {

        this.loaderService.display(true);
        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
        });

        // this.autoCompleteService.setDynamicList([]);

        if (this.nodeId) {
            let postObj: any = {}
            postObj.nodeType = 'Facilities';
            postObj.id = this.nodeId;
            this._pagesService.getNode(postObj).subscribe(
                data => {
                    this.visitorModel = data[0].fields;
                    this.visitorModel.id = data[0].id;
                    this.isNewUpdate = false;
                    this.loaderService.display(false);
                },
                error => {
                    this.loaderService.display(false);
                }
            );
        } else {
            this.loaderService.display(false);
        }

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    }

    public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
      }
    
      public showNextWebcam(directionOrDeviceId: boolean|string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        let blob = this.dataURLtoBlob(webcamImage.imageAsDataUrl);
          // this.errorMsg = "";
          let _formData = new FormData();
          // _formData.append("Name", this.Name);
          _formData.append("uploadFile", blob, 'image.jpg');
          // console.log(this.filedata);
          // return false;
          let body = _formData;
          this.loaderService.display(true);
          this._pagesService.uploadImage(_formData).subscribe(
            data => {
              this.loaderService.display(false);
              this.visitorModel.userImg = data['url'];
            },
            error => {
              this.loaderService.display(false);
              // this.errorMsg = error.error.message;
            }
        );
      }

      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    
      public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
      }
    
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }

    getFirstName(event){
        if(this.visitorModel.fName.length > 2){
       
            const searchObject = {
                "firstName": {
                    "startsWith": this.visitorModel.fName
                }
            }
            this._pagesService.searchUser(searchObject).subscribe((userSerach) => {
                this.userFirstName = [];
                userSerach.map((user) => {                
                    if (user.firstName != undefined && user.firstName !== '') {
                        this.userFirstName.push(user.firstName);
                    }
                });
            });
        }
    }

    getLastName(event){
        if(this.visitorModel.lName.length > 2){
            const searchObject = {
                "lastName": {
                    "startsWith": this.visitorModel.lName
                }
            }
            this._pagesService.searchUser(searchObject).subscribe((userSerach) => {
                this.userLastName = [];
                userSerach.map((user) => {                
                    if (user.firstName != undefined && user.firstName !== '') {
                        this.userLastName.push(user.lastName);
                    }
                });
            });
        }
    }

    getDoorList(event){
console.log('visiror');
        if(this.visitorModel.toVisit.length > 2){
            const searchObject = {
                "doorNo": {
                    "startsWith": this.visitorModel.toVisit
                }
            }
            this._pagesService.searchUser(searchObject).subscribe((userSerach) => {
                this.doorNoList = [];
                userSerach.map((user) => {                
                    if (user.doorNo != undefined && user.doorNo !== '') {
                        this.doorNoList.push(user.doorNo);
                    }
                });
            });
        }
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
                this.visitorModel.previewURL = results.url;
                this.previewUrlErrMsg = "";
            } else {
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

        if (this.visitorModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.visitorModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {
            if (results != undefined) {
                this.visitorModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
            } else {
                this.thumbnailErrMsg = "required";
            }

        }, (reason) => {

            this.thumbnailErrMsg = "required";
        });
    }

    fileEvent(e){
        this.filedata = e.target.files[0];
        console.log(	this.filedata);
    }
    
    upoadImage(): void {
        // this.errorMsg = "";
        let _formData = new FormData();
        // _formData.append("Name", this.Name);
        _formData.append("uploadFile", this.filedata);
        // console.log(this.filedata);
        // return false;
        let body = _formData;
        this.loaderService.display(true);
        this._pagesService.uploadImage(_formData).subscribe(
          data => {
            this.loaderService.display(false);
            this.visitorModel.userImg = data['url'];
          },
          error => {
            this.loaderService.display(false);
            // this.errorMsg = error.error.message;
          }
      );
       
      }


    submitForm() {

        this.loaderService.display(true);
 
        if (this.isNewUpdate) {
            let postObj = { ...this.visitorModel };
            delete postObj.apprStatus;
            postObj.apprStatus = [{ status: this.visitorModel.apprStatus, time: new Date() }];
            delete postObj.toVisit;
            postObj.toVisit = { doorNo: this.visitorModel.toVisit, id: 'USER_' + this._globals.getDateMilliSecond() };

            this._pagesService.addVisitor({ fields: postObj }).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.loaderService.display(true);
                    this.router.navigate(['/pages/visitor'])

                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.loaderService.display(false);
                    this.showToast(this.type, this.title, this.content);
                }
            );
        } else {
            // let postObj: any = {}
            // postObj.nodeType = "Facilities";
            // postObj.fields = this.visitorModel;
            // postObj.id = this.visitorModel.id;
            // this.content = "Facility stored successfully."
            // this._pagesService.updateNode(postObj).subscribe(
            //     data => {
            //         this.loaderService.display(false);
            //         this.showToast(this.type, this.title, this.content);
            //         this.router.navigate(['/pages/facilities'])
            //     },
            //     error => {
            //         this.type = 'error';
            //         this.title = "Error";
            //         this.content = "Something went wrong";
            //         this.loaderService.display(false);
            //         this.showToast(this.type, this.title, this.content);
            //     }
            // );
        }

    }

    onChangeApproval(event) {
        console.log(event.target.value);
    }
}