import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../events/modal/modal.component';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { DataService } from '../../../data.service';
import { Subject } from 'rxjs/Subject';
import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    OnInit
} from '@angular/core';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';


@Component({
    selector: 'ngx-add-appointment',
    templateUrl: './booking-appointment.component.html',
    styleUrls: ['./booking-appointment.component.scss'],
})

export class BookingAppointmentComponent implements OnInit {

    public bookingModel: any = {};
    colors: any = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        blue: {
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        }
    };
    appointsment: any = [];
    appointmentId = "";
    public data: Array<any> = [];

    view: string = 'month';

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen: boolean = true;

    public images: any;
    // public activeModal;
    public activeModal: NgbModalRef;
    private activeThumnailModal: NgbModalRef;
    public thumbnailErrMsg = "";
    public previewUrlErrMsg = "";
    toastConfig: ToasterConfig;
    position = 'toast-top-right';
    animationType = 'fade';
    title = 'Booking Update!';
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
    public facilities: any = [];
    public displayPart;

    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private _globals: Globals, private loaderService: LoaderService, private dataService: DataService) {
        this.bookingModel.facilityID = "";
        this.dataService.bookingType.subscribe(res => this.displayPart = res);
    }

    ngOnInit() {

        this.getFacilities();

        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
        });

        if (this.nodeId) {
            let postObj: any ={
                "id":  this.nodeId 
              }
            // postObj.nodeType = 'Bookings';
            // postObj.id = this.nodeId;
              console.log('get booking');
            this._pagesService.getBooking(postObj).subscribe(
                data => {
                    this.bookingModel = data[0].fields;
                    this.bookingModel.id = data[0].id;
                    this.bookingModel.bookingID = data[0].bookingID;
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
                this.bookingModel.previewURL = results.url;
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

        if (this.bookingModel.thumbnailURL != undefined) {
            this.activeThumnailModal.componentInstance.selectedImageId = this.bookingModel.thumbnailURL.id;
        }

        this.activeThumnailModal.result.then((results) => {
            if (results != undefined) {
                this.bookingModel.thumbnailURL = results.url;
                this.thumbnailErrMsg = "";
            } else {
                this.thumbnailErrMsg = "required";
            }

        }, (reason) => {

            this.thumbnailErrMsg = "required";
        });
    }

    submitForm() {
        if (this.isNewUpdate) {
            let postObj: any = {}
            this.loaderService.display(true);
            postObj.bookingType = "Bookings";
            postObj.fields = this.bookingModel;
            postObj.fields.name = (localStorage.getItem('name')!== undefined) ? localStorage.getItem('name'): '';
            let currentMiliS = this._globals.getDateMilliSecond();
            postObj.bookingID = "BOOK_" + currentMiliS;
            postObj.bookingType = 'Appointments';
            postObj.enterpriseID = localStorage.getItem('email');
            // postObj.userEmail = localStorage.getItem('email');
            postObj.fields.facilityID = localStorage.getItem('email');;
            postObj.facilityID = localStorage.getItem('email');
            this._pagesService.saveBooking(postObj).subscribe(
                data => {
                    this.title = "Booking";
                    this.content = "Booking added successfully";
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/bookings'])
                    this.loaderService.display(false);
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                    this.loaderService.display(false);
                }
            );
        } else {

            let postObj: any = {}
            postObj.bookingType = "Bookings";
            postObj.fields = this.bookingModel;
            postObj.id = this.bookingModel.id;
            postObj.fields.facilityID = localStorage.getItem('email');;
            this.content = "Bookings stored successfully."
            this._pagesService.updateBooking(postObj).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/bookings'])
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

    public getFacilities() {
        this.loaderService.display(true);
        this._pagesService.getNodes("Bookings").subscribe(
            data => {
                this.data = [];
                this.events = [];
                let tempData: any = {};
                for (var key in data) {

                    if (data[key].fields['bookingType'] === 'Appointments') {
                        tempData = data[key].fields
                        tempData.id = data[key].id;
                        this.data.push(tempData);

                        let eventOb: any = {};
                        eventOb = {
                            start: new Date(tempData.startTime),
                            title: tempData.bookedBy,
                            color: this.colors.yellow,
                            id: tempData.id,
                            actions: this.actions,
                        };
                        if (this.appointmentId != '') {
                            if (tempData.facilityID == this.appointmentId) {
                                this.events.push(eventOb);
                            }
                        } else {
                            this.events.push(eventOb);
                        }

                        this.refresh.next();
                    }

                }
                this.refresh.next();
                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
            }
        );
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {

        if (action == 'Deleted') {
            // TODO delete modal
            // this.activeModal = this._modalService.open(DeleteModalComponent, {
            //     size: 'sm',
            //     backdrop: 'static',
            //     container: 'nb-layout',
            // });

            // this.activeModal.componentInstance.modalHeader = 'Large Modal';
            // this.activeModal.componentInstance.previewURLs = this.images;


            this.activeModal.result.then((results) => {
                if (results != undefined && results != 'yes') {

                    this._pagesService.deleteNode(event.id).subscribe(
                        data => {
                            this.showToast(this.type, this.title, this.content);
                            this.loaderService.display(false);
                            this.getFacilities();
                        },
                        error => {

                        }
                    );
                }

            }, (reason) => {

            });
        } else {

            this.router.navigate(['/pages/bookings/edit/' + event.id])
        }

        // this.modalData = { event, action };
        // this.modal.open(this.modalContent, { size: 'lg' });
    }

}