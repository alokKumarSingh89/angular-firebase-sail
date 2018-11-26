import { PagesService } from '../../pages.service';
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
import { AddModalComponent } from '../modal/add-modal.component';
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
import { DemoUtilsModule } from '../../demo-utils/module';


const colors: any = {
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

@Component({
  selector: 'attendance-list',
  templateUrl: 'attendance-list.component.html',
  styleUrls: ['./attendance-list.scss']
})
export class AttendanceListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Member Delete!';
  content = `Member Deleted Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  canSendNotification = true;
  userType = [];
  memberList = [];
  atttendanceList = [];
  attendeeList = [];
  isDisplayCalenderView: boolean = true;
  editAttendanceModal:any ={};

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
  ];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  public columns: Array<any> = [
    // { title: 'Badge Id', name: 'badge_id', filtering: { filterString: '', placeholder: 'Filter by Badge Id' } },
    { title: 'FirstName', name: 'firstName', filtering: { filterString: '', placeholder: 'Filter by First Name' } },
    { title: 'LastName', name: 'lastName', filtering: { filterString: '', placeholder: 'Filter by Last Name' } },
    { title: 'Email', name: 'email', filtering: { filterString: '', placeholder: 'Filter by Email' } },
    { title: 'Attendace Date', name: 'attendaceDate' }





  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public canCreate = false;
  public canEdit = false;
  public canView = false;
  public maxDate : any;
  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered'],

  };

  public rows: Array<any> = [];

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, public loaderService: LoaderService, private modal: NgbModal) {
    this.length = this.data.length;
    this.canCreate = _globals.canCreate('Attendance');
    this.canEdit =  _globals.canEdit('Attendance');
    this.canView = _globals.canView('Attendance');
    this.config.canSendNotification = false;
    // this.config.canEdit =false;
    this.config.canAdd = _globals.canEdit('Attendance');
    this.config.canAttendace = _globals.canEdit('Attendance')
    this.userType = this._globals.USER_ROLE;
    let date = new Date();  

  }

  public ngOnInit(): void {

    this.loaderService.display(true);
    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }

    this.getMembersList();
  }



  public getMembersList() {
    this._pagesService.getMembers().subscribe(
      data => {
        this.data = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key];
          if (tempData.badge_id == undefined) {
            tempData.badge_id = "EMP_001";
          }

          // this.data.push(tempData);
          this.memberList.push(tempData);
        }

        let postData: any = {};
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7);
        postData.start_date = this._globals.getDateFormat(currentDate);
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        postData.end_date = this._globals.getDateFormat(nextDate);
        let date = new Date();
        // let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        let  nextDay = new Date();
        nextDay.setDate(nextDay.getDate()+1);
        this.maxDate = nextDay;
        postData.start_date = this._globals.getDateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
        postData.end_date = this._globals.getDateFormat(nextDay);
        let attendanceList = this.getAttendanceList(postData);

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

  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].toLowerCase().match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].toLowerCase().match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().toLowerCase().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });

      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {

    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {

  }

  public onCellEdit(data: any) {
    this.editAttendanceModal.id = data.row.att_id;
    this.editAttendanceModal.user_type = data.row.user_type;
    this.editAttendanceModal.entry_time = data.row.entry_time;
    this.editAttendanceModal.exit_time = data.row.exit_time;
    this.editAttendanceModal.note = data.row.note;
    this.editAttendanceModal.reference = data.row.reference;
    this.editAttendanceModal.badge_id = data.row.badge_id;

    const activeModal = this._modalService.open(AddModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Large Modal';
    activeModal.componentInstance.attendanceModal = this.editAttendanceModal;

      var id = data.row.id;
      activeModal.result.then((results) => {
      let postObj: any = {};
      postObj = results;

      if (results != undefined && results != 'yes') {
        this._pagesService.updatAttendance(postObj).subscribe(
          data => {
            this.title = "Attendance";
            this.content = "Attendance updated successfully."
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/events'])
            // this.getUpdatesList();
          },
          error => {
            this.type = 'error';
            this.title = "Error";
            this.content = "Something went wrong";
            this.showToast(this.type, this.title, this.content);
          }
        );
      }

    }, (reason) => {

    });


  }

  public onCellNotification(data: any) {

    this.activeModal = this._modalService.open(NotificationModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });
    this.activeModal.componentInstance.notificationModel = Object.assign({}, data.row);

    var id = data.row.id;
    this.activeModal.result.then((results) => {

      let postObj: any = {}
      postObj = data;
      if (results != undefined && results != 'yes') {

        postObj.nodeType = "Events";
        postObj.fields = results;
        postObj.id = id;
        delete postObj['row'];
        this._pagesService.updateNode(postObj).subscribe(
          data => {
            this.title = "Event Update";
            this.content = "Event updated successfully."
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/events'])
            this.getMembersList();
          },
          error => {
            this.type = 'error';
            this.title = "Error";
            this.content = "Something went wrong";
            this.showToast(this.type, this.title, this.content);
          }
        );
      }

    }, (reason) => {

    });
  }


  onCellAdd(data: any) {

    const activeModal = this._modalService.open(AddModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Large Modal';

      var id = data.row.id;
      activeModal.result.then((results) => {
      let postObj: any = {};
      postObj = results;
      postObj.badge_id = data.row.badge_id;
      if (results != undefined && results != 'yes') {
        this._pagesService.saveAttendance(postObj).subscribe(
          data => {
            this.title = "Attendance";
            this.content = "Attendance added successfully."
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/events'])
            // this.getUpdatesList();
          },
          error => {
            this.type = 'error';
            this.title = "Error";
            this.content = "Something went wrong";
            this.showToast(this.type, this.title, this.content);
          }
        );
      }

    }, (reason) => {

    });

  }

  public getAttendanceList(postObj) {
    let attendeeList: any[];
    let finalAttendance: any = [];
    this.events = [];
    this.data = [];
    this.onChangeTable(this.config);
    this._pagesService.getAttendance(postObj).subscribe(
      res => {

        let start = new Date(postObj.start_date);
        let end = new Date(postObj.end_date);
        let loop = new Date(start);

        while (loop < end) {

          let sDate = JSON.parse(JSON.stringify(loop));
          let loDate = new Date(JSON.parse(JSON.stringify(loop)));
          // loDate = new Date(loDate.setDate(loDate.getDate()- 1));
          let found = 0;
          let totalEmployees = this.memberList.length;
          let findDate: any;
          this.memberList.forEach((element, eIndex) => {
             
          if (res['attendances'].length > 0) {
            let isFound = false;
            let notFoundRecords:any = {};
            res['attendances'].forEach((attendaceEle, attenIndex) => {

                let firstDate = new Date(JSON.parse(JSON.stringify(loDate)));
                let secondDate = new Date(JSON.parse(JSON.stringify((attendaceEle.entry_time))));

                if (firstDate.setHours(0, 0, 0, 0) == secondDate.setHours(0, 0, 0, 0) && element.badge_id == attendaceEle.badge_id) {
                  let formateDate = this._globals.getDateFormat(new Date(JSON.parse(JSON.stringify(secondDate))));
                    // Object.
                  findDate = secondDate;
                  let elementObj:any = {};
                  elementObj = Object.assign({}, element);
                  elementObj.attendaceDate = formateDate;
                  elementObj.attendaceFullDate = new Date(JSON.parse(JSON.stringify(attendaceEle.entry_time)));
                  if(this.config.canAttendace == false){
                    elementObj.isAttendeeedit = false;
                  }else{
                    elementObj.isAttendeeedit = true;
                  }
                 
                  elementObj.entry_time = new Date(JSON.parse(JSON.stringify(attendaceEle.entry_time)));
                  elementObj.exit_time = new Date(JSON.parse(JSON.stringify(attendaceEle.exit_time)));
                  elementObj.att_id = attendaceEle.id;
                  elementObj.user_type = attendaceEle.user_type;
                  if(attendaceEle.note != undefined && attendaceEle.note != null){
                    elementObj.note = attendaceEle.note;
                  }
                  if(attendaceEle.reference != undefined && attendaceEle.reference != null){
                    elementObj.reference = attendaceEle.reference;
                  }
                 
                  elementObj.isAttendeenew = false;
                  finalAttendance.push(elementObj);
                  this.data.push(elementObj);
                  found++;
                  isFound = true;

                } else {
  
                  let formateDate = this._globals.getDateFormat(new Date(JSON.parse(JSON.stringify(firstDate))));
                  let elementObj:any = {};
                  elementObj = Object.assign({}, element);
                  elementObj.attendaceDate = formateDate;
                  elementObj.attendaceFullDate = new Date(JSON.parse(JSON.stringify(loDate)));
                  if(this.config.canAttendace == false){
                    elementObj.isAttendeenew = false;
                    elementObj.isAttendeeedit = false;
                  }else{
                    elementObj.isAttendeenew = true;
                    elementObj.isAttendeeedit = false;
                  }

                  // finalAttendance.push(element);
                  // this.data.push(element);

                  notFoundRecords = elementObj;

                }
              });

              if(!isFound){
                  finalAttendance.push(notFoundRecords);
                  this.data.push(notFoundRecords);
                
              }
              

            }else{
              let formateDate = this._globals.getDateFormat(new Date(JSON.parse(JSON.stringify(loDate))));

              // let firstDate = new Date(JSON.parse(JSON.stringify(loDate)));
              element.attendaceDate = formateDate;
              element.attendaceFullDate = new Date(JSON.parse(JSON.stringify(loDate)));
              if(this.config.canAttendace == false){
                element.isAttendeenew = false;
                element.isAttendeeedit = false;
              }else{
                element.isAttendeenew = true;
                element.isAttendeeedit = false;
              }

              finalAttendance.push(element);
              this.data.push(element);
            }



          });


          this.events.push({
            start: new Date(JSON.parse(JSON.stringify(loop))),
            title: 'Absent - ' + (totalEmployees - found),
            color: colors.red,
            actions: this.actions
          });

          this.events.push({
            start: new Date(JSON.parse(JSON.stringify(loop))),
            // end: loop,
            title: 'Present - ' + (found),
            color: colors.blue,
            actions: this.actions
          });
          let tdate = loop;
          let newDate = tdate.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
          this.refresh.next();

        }
        this.data = finalAttendance;
        this.onChangeTable(this.config);
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
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });

    let loDate = new Date(JSON.parse(JSON.stringify(event.start)));
    let startDate = loDate;
    let year = startDate.getFullYear();
    let month = startDate.getMonth();
    let d = new Date(JSON.parse(JSON.stringify(event.start)));
    // d.setMonth(d.getMonth() + 1);
    d.setDate(d.getDate() + 1);
    let endDate = d;
    let postData: any = {};
    postData.start_date = this._globals.getDateFormat(startDate);
    postData.end_date = this._globals.getDateFormat(endDate);
    this.data = [];
    this.onChangeTable(this.config);
    let attendanceList = this.getAttendanceList(postData);

    this.isDisplayCalenderView = false;
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  onDatechanged() {

    this.loaderService.display(true);
    let loDate = new Date(JSON.parse(JSON.stringify(this.viewDate)));
    let startDate = loDate;
    let year = startDate.getFullYear();
    let month = startDate.getMonth();
    startDate = ((new Date(year, month)));
    let d = (new Date(year, month, 1));
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    let endDate = d;
    let postData: any = {};
    postData.start_date = this._globals.getDateFormat(startDate);

    if(endDate > this.maxDate){
      endDate = this.maxDate;
    }
    postData.end_date = this._globals.getDateFormat(endDate);
    let attendanceList = this.getAttendanceList(postData);
  }

  displayCalendarView(){

    let date = new Date();
    let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if(endDate > this.maxDate){
      endDate = this.maxDate;
    }
    let postData:any = {};
    postData.start_date = this._globals.getDateFormat(startDate);
    postData.end_date = this._globals.getDateFormat(endDate);
    let attendanceList = this.getAttendanceList(postData);
    this.isDisplayCalenderView=true;
  }


  public onCellDelete(data: any) {

    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {

        this._pagesService.deleteAttendance(data.row.att_id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.loaderService.display(true);
            this.displayCalendarView();
          },
          error => {

          }
        );
      }

    }, (reason) => {

    });
  }

}
