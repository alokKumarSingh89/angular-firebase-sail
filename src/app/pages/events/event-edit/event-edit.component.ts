import { Component, OnInit } from '@angular/core';
// import { EventModel } from './../../event.model';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { ThumbnailModalComponent } from '../modal/thumbnailModal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { isNull } from 'util';
import { isEmpty } from '@firebase/util/dist/esm/src/obj';

@Component({
    selector: 'edit-event',
    templateUrl: './event-edit.component.html',
    styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {

    public eventModel: any = {};
    public slotModel: any = {};
    public contactModel: any = {};
    public images: any;
    // public activeModal;
    public activeModal: NgbModalRef;
    private activeThumnailModal: NgbModalRef;
    public thumbnailErrMsg = "";
    public previewUrlErrMsg = "";
    toastConfig: ToasterConfig;
    position = 'toast-top-right';
    animationType = 'fade';
    title = 'Event Update!';
    content = `Event Added Sucessfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = true;
    public nodeId;
    public slotErrorMsg = '';
    public slots = '';
    public slotList: any = [];
    public contactList: any = [];

    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private _globals: Globals, private loaderService: LoaderService) {

    }

    ngOnInit() {

        this._pagesService.getImages().subscribe(
            data => {
                this.images = data;
            },
            error => {

            }
        );

        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
        });

        if (this.nodeId) {
            let postObj: any = {}
            postObj.nodeType = 'Events';
            postObj.id = this.nodeId;
            this._pagesService.getNode(postObj).subscribe(
                data => {
                    this.eventModel = data[0].fields;
                    this.eventModel.id = data[0].id;
                    this.eventModel.eventID = data[0].eventID;
                    this.slotList = data[0].fields.slots;
                    this.contactList = data[0].fields.contacts;
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
                this.eventModel.previewURL = results.url;
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

    submitForm() {
        this.loaderService.display(true);
        if (this.isNewUpdate) {
            let postObj: any = {}
            postObj.nodeType = "Events";
            postObj.fields = this.eventModel;
            postObj.fields.eventID = "EVT_" + this._globals.getDateMilliSecond();
            // postObj.eventID = "EVT_" + this._globals.getDateMilliSecond();
            postObj.fields.slots = this.slotList;
            postObj.fields.contacts = this.contactList;
            
            console.log(postObj);
            // return false;
            this._pagesService.saveNode(postObj).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/events'])
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                    this.loaderService.display(false);
                },
            );
        } else {

            let postObj: any = {}
            postObj.nodeType = "Events";
            postObj.fields = this.eventModel;
            postObj.id = this.eventModel.id;
            this.content = "Events stored successfully."
            this._pagesService.updateNode(postObj).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/events'])
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                    this.loaderService.display(false);
                }
            );
        }
    }

    addTimeSlot() {

        let slotObject = {};

        slotObject = {
            name: this.slotModel.slotname,
            description: this.slotModel.slotdescription,
            startTime: this.slotModel.eventStartTime,
            endTime: this.slotModel.eventEndTime,
            capacity: this.slotModel.slotCapacity,
        }

        if (this.slotModel.eventStartTime === undefined || this.slotModel.eventEndTime === undefined) {
            // this.slotErrorMsg = 'Please select start event start and end date';
        } else {
            let slotTemp: any = {};
            slotTemp = {
                startDate: JSON.parse(JSON.stringify(this.slotModel.eventStartTime)),
                endtDate: JSON.parse(JSON.stringify(this.slotModel.eventEndTime))
            }
            // slots
            this.slotList.push(slotObject);
            // this.slotModel = {};
            this.slotErrorMsg = '';
        }
    }

    addContact() {
        if (!isEmpty(this.contactModel)) {
            let contactObj = {};
            contactObj = {
                name: this.contactModel.contactName,
                phone: this.contactModel.contactPhoneNo,
                email: this.contactModel.contactEmail,
            }
            this.contactList.push(contactObj);

        }
    }
}