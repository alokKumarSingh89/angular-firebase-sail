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

import { Subject } from 'rxjs/Subject';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { NotificationModalComponent } from '../../events/modal/NotificationModal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { Console } from '@angular/core/src/console';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { PagesService } from '../../pages.service';
import { DataService } from '../../../data.service';

@Component({
  selector: 'booking-list',
  templateUrl: 'bookings-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})



export class BookingListComponent implements OnInit {
  name: string;
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
  facilities: any = [];
  facilityId = "";
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Booking Delete!';
  content = `Booking Deleted Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  canSendNotification = true;
  displayPart = 'Event';
  selectedBookingType = 'Event';

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

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

  constructor(private modal: NgbModal, private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService, private dataService: DataService) {

    this.dataService.bookingType.subscribe(res => {
      this.displayPart = res;
      this.selectedBookingType = res;
      // this.loaderService.display(true);
    });
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
      this.activeModal = this._modalService.open(DeleteModalComponent, {
        size: 'sm',
        backdrop: 'static',
        container: 'nb-layout',
      });

      // this.activeModal.componentInstance.modalHeader = 'Large Modal';
      // this.activeModal.componentInstance.previewURLs = this.images;


      this.activeModal.result.then((results) => {
        if (results != undefined && results != 'yes') {

          this._pagesService.deleteNode(event.id).subscribe(
            data => {
              this.showToast(this.type, this.title, this.content);
              this.loaderService.display(false);
              this.getBookingList();
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

  ngOnInit() {
    this.getFacilities();

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


  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: this.colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }


  public getBookingList() {
    this._pagesService.getNodes("Bookings").subscribe(
      data => {
        this.data = [];
        this.events = [];
        let tempData: any = {};
        for (var key in data) {

          if (data[key].fields['facilityID'] !== undefined) {
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
            if (this.facilityId != '') {
              if (tempData.facilityID == this.facilityId) {
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
        this.refresh.next();
        this.loaderService.display(false);
      }
    );
  }

  public getFacilities() {
    this.loaderService.display(true);
    this._pagesService.getNodes("Facilities").subscribe(
      data => {
        this.data = [];
        let tempData: any = {};
        for (var key in data) {

          tempData = data[key].fields;
          tempData.bookingAmount = String(data[key].fields.bookingAmount);
          tempData.id = data[key].id;
          this.facilities.push(tempData);
        }
        // this.loaderService.display(false);
        this.getBookingList();
      },
      error => {
        this.getBookingList();
        // this.loaderService.display(false);
      }
    );
  }

  onBookingChange($event, facilityId) {
    this.facilityId = facilityId;
    this.getBookingList();
  }

  onBookingTypeChange(event, type) {
    // this.displayPart = type;
    this.dataService.changeType(this.selectedBookingType);
    // this.loaderService.display(true);
  }

}
