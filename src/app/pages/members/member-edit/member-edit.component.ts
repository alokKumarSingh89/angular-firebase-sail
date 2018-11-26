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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'member-event',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {

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
    title = 'Member Update!';
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

    editMemberForm;

    userImage = '../../../../assets/images/user.png';

    constructor(
        private _pagesService: PagesService,
        private _modalService: NgbModal,
        private _toasterService: ToasterService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _globals: Globals,
        public loaderService: LoaderService,
        public _fb: FormBuilder) {

    }
    ngOnInit() {

        
        /*this._pagesService.getImages().subscribe(
            data => {
                this.images = data;
            },
            error => {

            }
        );*/

        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
            console.log('>>>', this.nodeId);
        });

        // checking if id is present or not
        if (this.nodeId !== "undefined" && this.nodeId !== '') {
            this.searchUser();
        }
        else{
            this.type = 'error';
            this.title = "Error";
            this.content = "Something went wrong";
            this.showToast(this.type, this.title, this.content);

            this.router.navigate(['/pages/members']);
        }

        this.editMemberForm = this._fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            user_id: [''],
            badge_id: ['', Validators.required],
            role: ['', Validators.required],
            role_status: ['', Validators.required],
            door_no: [''],
            zip_code: [''],
            street: [''],
            state: [''],
            country: [''],
            address: [''],
            phone: [''],
            email: ['', [Validators.required, Validators.email]],
            joined_orgs: [''],
            pending_orgs: [''],
            device_token_ios: [''],
            device_token_android: [''],
        })
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
        this.activeModal = this._modalService.open(ThumbnailModalComponent, { size: 'lg', container: 'nb-layout' });

        this.activeModal.componentInstance.modalHeader = 'Large Modal';
        this.activeModal.componentInstance.previewURLs = this.images;

        this.activeModal.result.then((results) => {
            if (results != undefined) {
                this.eventModel.profileImageURL = results.url;
                this.previewUrlErrMsg = "";
            } else {
                this.previewUrlErrMsg = "required";
            }

        }, (reason) => {
            this.previewUrlErrMsg = "required";
        });
    }

    public getEventList() {

        this._pagesService.getMembers().subscribe(
            data => {
                this.data = [];
                let tempData: any = {};
                for (var key in data) {
                    tempData = data[key]
                    // tempData.id = data[key].id;
                    this.data.push(tempData);
                    if (data[key].id == this.nodeId) {
                        this.eventModel = tempData;
                    }
                }

                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
            }
        );

    }

    /**
     * API call to fetch edited memeber details
     * @param postObj 
     */
    searchUser() {

        let postObj = {
            "limit" : "10",
            "offset" : "0",
            "userID": this.nodeId
        }

        this.loaderService.display(true);
        this._pagesService.searchUser(postObj).subscribe(data => {
            
            // if user data found successfully
            if(data[0] !== undefined && data[0] !== '0'){
                
                this.eventModel = data[0];
                
                if(this.eventModel['approvalPendingEmails'] !== undefined && this.eventModel['approvalPendingEmails'] !== '' && Array.isArray(this.eventModel['parentEmail'])){
                    this.eventModel['approvalPendingEmails'] = this.eventModel['approvalPendingEmails'].join('\n'); 
                }
                

                if(this.eventModel['parentEmail'] !== undefined && this.eventModel['parentEmail'] !== '' && Array.isArray(this.eventModel['parentEmail'])){
                    this.eventModel['parentEmail'] = this.eventModel['parentEmail'].join('\n'); 
                }



                this.loaderService.display(false);
            }
            else{
                this.type = 'error';
                this.title = "Error";
                this.content = "Something went wrong";
                this.showToast(this.type, this.title, this.content);

                this.loaderService.display(false);

                this.router.navigate(['/pages/members']);
            }
           
        }, (error) => {
            this.type = 'error';
            this.title = "Error";
            this.content = "Something went wrong.";
            this.showToast(this.type, this.title, this.content);

            this.loaderService.display(false);

            this.router.navigate(['/pages/members']);
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
                this.eventModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
            } else {
                this.thumbnailErrMsg = "required";
            }

        }, (reason) => {

            this.thumbnailErrMsg = "required";
        });
    }

    submitForm(values) {

        let postData = {
            id: this.eventModel['id'],
            userID: values.user_id,
            firstName: values.firstname,
            lastName: values.lastname,
            badgeID: values.badge_id,
            roleType: values.role,
            roleStatus: values.role_status,
            doorNo: values.door_no,
            zipcode: values.zip_code,
            street: values.street,
            State: values.state,
            Country: values.country,
            address: values.address,
            phone: values.phone,
            email: values.email,
            parentEmail: values.joined_orgs.split('\n'),
            approvalPendingEmails: values.pending_orgs.split('\n'),
            deviceToken: values.device_token_ios,
            deviceToken_iOS: values.device_token_android,
            profileImageURL:  this.eventModel.profileImageURL
        }

        
        this._pagesService.updateMember(postData).subscribe(
            data => {
                this.showToast(this.type, this.title, this.content);
                this.router.navigate(['/pages/members'])
            },
            error => {
                this.type = 'error';
                this.title = "Error";
                this.content = "Something went wrong";
                this.showToast(this.type, this.title, this.content);
            }
        );

        // this.loaderService.display(true);
        // if (this.isNewUpdate) {
        //     let postObj: any = {}
        //     postObj.nodeType = "Member";
        //     postObj = this.eventModel;
        //     console.log("modal>>", postObj);
        //     this._pagesService.updateMember(postObj).subscribe(
        //         data => {
        //             this.showToast(this.type, this.title, this.content);
        //             this.router.navigate(['/pages/members'])
        //         },
        //         error => {
        //             this.type = 'error';
        //             this.title = "Error";
        //             this.content = "Something went wrong";
        //             this.showToast(this.type, this.title, this.content);
        //         }
        //     );
        // } else {

        //     let postObj: any = {}
        //     // postObj.nodeType = "Events";
        //     postObj = this.eventModel;
        //     // postObj.id = this.eventModel.id;
        //     this.content = "Member stored successfully."
        //     this._pagesService.updateProfile(postObj).subscribe(
        //         data => {
        //             this.loaderService.display(false);
        //             this.showToast(this.type, this.title, this.content);
        //             this.router.navigate(['/pages/members']);
        //         },
        //         error => {
        //             this.type = 'error';
        //             this.title = "Error";
        //             this.content = "Something went wrong";
        //             this.showToast(this.type, this.title, this.content);
        //             this.loaderService.display(false);
        //         }
        //     );
        // }
    }
}
