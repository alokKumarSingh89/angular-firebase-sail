import { Component, OnInit } from '@angular/core';
// import { EventModel } from './../../event.model';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../events/modal/modal.component';
import { ThumbnailModalComponent } from '../../events/modal/thumbnailModal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';

@Component({
    selector: 'profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {

    public data: any = [];
    public eventModel: any = {};
    public images: any;
    // public activeModal;
    public activeModal: NgbModalRef;
    private activeThumnailModal: NgbModalRef;
    public thumbnailErrMsg = "";
    public previewUrlErrMsg = "";
    toastConfig: ToasterConfig;
    position = 'toast-top-right';
    animationType = 'fade';
    title = 'Profile Update!';
    content = `Member Added Sucessfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = false;
    public nodeId;
    public profileObject: any = {};
    public profileImageURLs: any = [];
    public previewImages: any = [];
    public enterpriseUser = {};

    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private _globals: Globals, public loaderService: LoaderService) {
        this.eventModel = {
            userDetails: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                enterprise: '',
                parentEmail: '',
                profileImageURL: '',
            },
            enterpriseDetails: [
                {
                    fields: {
                        name: '',
                        joinID: '',
                        city: '',
                        address: '',
                        descShort: '',
                    }
                }
            ]
        }
    }

    ngOnInit() {

        this._pagesService.getImages().subscribe(
            data => {
                this.images = data;
            },
            error => {

            }
        );

        this.getprofile();
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

   /*  previewUrlModal() {
        this.activeModal = this._modalService.open(ThumbnailModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeModal.componentInstance.modalHeader = 'Large Modal';
        this.activeModal.componentInstance.previewURLs = this.images;

        this.activeModal.result.then((results) => {
            if (results != undefined) {
                this.eventModel.profileImageURL = results.url;
                // this.profileImageURLs.push(results.url);
                this.previewUrlErrMsg = "";
            } else {
                this.previewUrlErrMsg = "required";
            }

        }, (reason) => {

            this.previewUrlErrMsg = "required";
        });
    } */

    public getprofile() {

        this.loaderService.display(true);

        this._pagesService.getEnterpriseprofile({}).subscribe(
            data => {

                this.profileObject = Object.assign({}, data);;

                // if user details is present
                if (data['userDetails'] !== undefined && data['userDetails'] !== '') {
                    
                    this.eventModel.userDetails = data['userDetails'];
                }

                // checking if enterprise details are present
                if (data['enterpriseDetails'] !== undefined && data['enterpriseDetails'].length > 0 ) {
                    
                    this.eventModel.enterpriseDetails[0] = data['enterpriseDetails'][0];

                    if(data['enterpriseDetails'][0].fields !== undefined && data['enterpriseDetails'][0].fields !== ''){
                        this.eventModel.enterpriseDetails[0].fields = data['enterpriseDetails'][0].fields;
                        this.previewImages = data['enterpriseDetails'][0].fields.previewImages.split(",");
                    }
                }

                console.log(this.eventModel);
                /* this.eventModel = data['userDetails'];

                if (data['enterpriseDetails'] !== undefined) {
                    this.enterpriseUser = data['enterpriseDetails'];
                }


                if (data['enterpriseDetails'] !== undefined && data['enterpriseDetails'][0] !== undefined && data['enterpriseDetails'][0].fields !== undefined) {
                    this.eventModel.enterpriseDetails = data['enterpriseDetails'][0].fields;
                }
                else {
                    this.eventModel.enterpriseDetails = {};
                } */

                /* if (this.eventModel.enterpriseDetails !== undefined && this.eventModel.enterpriseDetails.previewImages !== undefined) {
                    this.previewImages = this.eventModel.enterpriseDetails.previewImages.split(",");
                } */

                console.log(this.eventModel);

                // this.eventModel.pName = data['enterpriseDetails'].fields.name;

                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
            }
        );
    }

    /**
     * 
     */
    previewURLModal() {

        this.activeThumnailModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeThumnailModal.componentInstance.modalHeader = 'Large Modal';
        this.activeThumnailModal.componentInstance.previewURLs = this.images;

        if (this.eventModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.eventModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {

            if (results != undefined) {
                if (this.previewImages.length <= 4) {
                    this.previewImages.push(results.url);
                    this.previewUrlErrMsg = "";
                }
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

        if (this.eventModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.eventModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {

            if (results != undefined) {
                this.eventModel.enterpriseDetails[0].fields.thumbnail = results.url;
                this.thumbnailErrMsg = "";
            } else {
                this.thumbnailErrMsg = "required";
            }

        }, (reason) => {

            this.thumbnailErrMsg = "required";
        });
    }

    /**
     * Function to submit form
     */
    submitForm() {

        console.log(this.eventModel);

        this.loaderService.display(true);

        this._pagesService.updateEnterpriseprofile(this.eventModel).subscribe(
            (data) => {
                this.loaderService.display(false);
                this.content = "Profile update request has been submitted to admin. You will be notified via email once  approved."
                this.showToast(this.type, this.title, this.content);
            },
            (error) => {
                this.type = 'error';
                this.title = "Error";
                this.content = "Something went wrong";
                this.showToast(this.type, this.title, this.content);
                this.loaderService.display(false);
            }
        );

        /* let postObj: any = this.profileObject;
        // postObj.userDetails = this.eventModel
        // delete postObj.userDetails.userDetails;
        let enterpriseObj: any = this.eventModel.enterpriseDetails
        this.eventModel['enterpriseDetails'] = this.enterpriseUser;
        this.eventModel['enterpriseDetails'][0]['fields'] = enterpriseObj;
        this.getprofile();
        this.content = "Profile update request has been submitted to admin. You will be notified via email once  approved."
        this._pagesService.updateEnterpriseprofile(postObj).subscribe(
            data => {
                this.loaderService.display(false);
                this.showToast(this.type, this.title, this.content);
                //  this.getprofile();

                //  this.router.navigate(['/pages/members']);
            },
            error => {
                this.type = 'error';
                this.title = "Error";
                this.content = "Something went wrong";
                this.showToast(this.type, this.title, this.content);
                this.loaderService.display(false);
                //  this.getprofile();

            }
        );

        this.loaderService.display(true); */

        // if(this.isNewUpdate){
        //         let postObj:any = {}
        //         postObj.nodeType = "Member";
        //         postObj = this.eventModel;
        //         console.log("modal>>", postObj);
        //         this._pagesService.updateMember(postObj).subscribe(
        //             data => {
        //                 this.showToast(this.type, this.title, this.content);
        //                 this.router.navigate(['/pages/members'])
        //             },
        //             error => {
        //                 this.type = 'error';
        //                 this.title = "Error";
        //                 this.content = "Something went wrong";
        //                 this.showToast(this.type, this.title, this.content);
        //             }
        //         );
        //     }else{

        //         let postObj:any = {}
        //         // postObj.nodeType = "Events";
        //         postObj = this.eventModel;
        //         // postObj.id = this.eventModel.id;
        //         this.content ="Member stored successfully."
        //         this._pagesService.updateProfile(postObj).subscribe(
        //             data => {
        //                 this.loaderService.display(false);
        //                 this.showToast(this.type, this.title, this.content);
        //                 this.router.navigate(['/pages/members']);
        //             },
        //             error => {
        //                 this.type = 'error';
        //                 this.title = "Error";
        //                 this.content = "Something went wrong";
        //                 this.showToast(this.type, this.title, this.content);
        //                 this.loaderService.display(false);
        //             }
        //         );
        //     }
    }

    deleteImage(index) {
        this.previewImages.splice(index, 1);
    }
}
