import { Component } from '@angular/core';
import { PagesService } from '../../pages.service';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { Globals } from '../../../globals';
import { NotificationModalComponent } from '../../events/modal/NotificationModal.component';
import { LoaderService } from '../../../loader.service';
import { ChangeStatusModalComponent } from '../../../models/change-status.model'
@Component({
  selector: 'visitor-list',
  templateUrl: 'visitor-list.component.html',
  styleUrls: ['./visitor-list.scss']
})
export class VisitorListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Visitor Delete!';
  content = `Visitor Deleted Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  public canCreate = false;
  public canEdit = false;
  public canView = false;
  public statusCounter = 0;
  startDate: any = new Date();
  endDate: any = new Date();
  selectedOrgType: any;
  firstName: any;
  intervalHandling = [];
  public columns: Array<any> = [
    { title: 'First Name', name: 'fName', filtering: { filterString: '', placeholder: 'Filter by First Name' } },
    {
      title: 'Purpose',
      name: 'purpose',
      sort: false,
      filtering: { filterString: '', placeholder: 'Filter by short purpose' }
    },
    { title: 'From Org', name: 'fromOrg' },
    { title: 'Status', name: 'apprStatus' },
    { title: 'To Visit', name: 'toVisit' },
    { title: 'Visit At', name: 'visitingTS' },
    { title: 'User Image' , name: 'userImg'}



  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };

  public rows: Array<any> = [];
  tracking: any;

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService) {
    this.length = this.data.length;
    this.canCreate = true;//_globals.canCreate('Facilities');
    this.canEdit = true;//_globals.canEdit('Facilities');
    this.canView = true;//_globals.canView('Facilities');
    this.config.canEdit = this.canEdit;
    this.config.canSendNotification = false;
  }

  public ngOnInit(): void {
    this.loaderService.display(true);
    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }
    this.getCurrentDateVisitorList();


  }


  getCurrentDateVisitorList() {

    let date = new Date();
    let day = new Date();
    let nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    let startDates = new Date();
    let endDates = nextDay;
    let postData: any = {};
    postData.start_date = this._globals.getDateFormat(startDates);
    postData.end_date = this._globals.getDateFormat(endDates);
    // console.log(postData);

    this.getVisitorList(postData);
  }

  public getVisitorList(postData) {
    this._pagesService.getVisitorList(postData).subscribe(
      data => {
        this.data = [];
        let tempData: any = {};
        for (var key in data) {
          let tempD = { ...data };
          tempData = data[key].fields;
          tempData.originalRes = Object.assign({}, data[key]);
          tempData.apprStatus = (data[key].fields.apprStatus[(data[key].fields.apprStatus.length - 1)].status) ? data[key].fields.apprStatus[(data[key].fields.apprStatus.length - 1)].status : '';
          tempData.purpose = (data[key].fields.purpose) ? data[key].fields.purpose : '';
          tempData.userImg = (data[key].fields.userImg) ? data[key].fields.userImg : '';
          tempData.visitorID = data[key].visitorID;



          // tempData.bookingAmount= String(data[key].fields.bookingAmount);
          // tempData.previewURL = (data[key].previewURL != undefined) ? data[key].previewURL : '';
          tempData.id = data[key].id;
          if(data[key].fields.toVisit !== undefined){
            tempData.toVisit = data[key].fields.toVisit.doorNo;
          } else {
            tempData.toVisit = '';
          }
          
          tempData.visitingTS = (data[key]['visitingTS'] != undefined) ? new Date((data[key]['visitingTS'])).toLocaleString() : '-';
          if (data[key].fields.fName != undefined) {
            this.data.push(tempData);
          }

        }
        this.onChangeTable(this.config);
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
          return item[column.name].toString().toLowerCase().match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].toString().toLowerCase().match(this.config.filtering.filterString));
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


    this.activeModal = this._modalService.open(ChangeStatusModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.componentInstance.visitorModel = { ...data.row };
    this.activeModal.result.then((results) => {
      if (results != undefined) {
        let updateVisitor = {};
        // this.loaderService.display(true);
        // let updateObj = Object.assign({}, data.row.originalRes); 
        this._pagesService.getVisitor(data.row.originalRes.id).subscribe(res => {

          updateVisitor = res;
          delete updateVisitor[0]['fields']['apprStatus'];
          updateVisitor[0]['fields']['apprStatus'] = [{ status: results.apprStatus, time: new Date() }];
          let postData = { status: results.apprStatus };
          this._pagesService.updateVisitorStatus(updateVisitor[0]['visitorID'], postData).subscribe(res => {

            if (updateVisitor[0]['fields']['apprStatus'][0]['status'] === 'Initiate Approval') {
              this.getCurrentDateVisitorList();
              this.title = "Checking Status";
              this.showToast(this.type, this.title, "Checking Status of visitor");
              // this.loaderService.display(true);
              this.startCheckingStatus(data.row.originalRes.id);
            } else {
              this.title = "Visitor Status";
              this.showToast(this.type, this.title, "Visitor status changed successfully");
              this.getCurrentDateVisitorList();
              this.loaderService.display(false);
            }

          }, err => {
            this.title = "Visitor Status";
            this.showToast('error', 'Error', "Something went wrong. Please try again");
            this.loaderService.display(false);
          });
        },
          err => {
            this.title = "Visitor Status";
            this.showToast('error', 'Error', "Something went wrong. Please try again");
            this.loaderService.display(false);
          });

      }

    }, (reason) => {

    });

  }


  startCheckingStatus(id) {

    this.tracking = setInterval(() => {
      //run code

      this._pagesService.getVisitor(id).subscribe(res => {
        const visitor = res;

        const dataIndex = this.data.findIndex(d => d.id === id);

        const findIndex = this.intervalHandling.findIndex(interval => interval.visitor_id === id);

        let tempData: any = {};
        tempData.apprStatus = (res[0].fields.apprStatus[(res[0].fields.apprStatus.length - 1)].status) ? res[0].fields.apprStatus[(res[0].fields.apprStatus.length - 1)].status : '';
        if (dataIndex >= 0) {
          if
          (this.data[dataIndex].apprStatus !== tempData.apprStatus) {
            this.data[dataIndex].apprStatus = (res[0].fields.apprStatus[(res[0].fields.apprStatus.length - 1)].status) ? res[0].fields.apprStatus[(res[0].fields.apprStatus.length - 1)].status : '';
            this.onChangeTable(this.config);
            this.stopCheckingStatus(findIndex);

            this.title = "Visitor Status";
            this.showToast(this.type, this.title, `${visitor[0]['fields']['fName']} ${visitor[0]['fields']['lName']}'s Entry ${this.data[dataIndex].apprStatus}`);
          }
        }




        // if (visitor[0]['fields']['apprStatus'][(visitor[0]['fields']['apprStatus'].length - 1)]['status'] === 'Approved') {
        //   this.title = "Visitor Status";
        //   this.showToast(this.type, this.title, `${visitor[0]['fields']['fName']} ${visitor[0]['fields']['lName']}'s Entry approved`);
        //   // const findIndex = this.intervalHandling.findIndex(interval => interval.visitor_id === id);
        //   if (findIndex >= 0) {
        //     this.stopCheckingStatus(findIndex);
        //   }

        //   this.getCurrentDateVisitorList();
        // } else if (visitor[0]['fields']['apprStatus'][(visitor[0]['fields']['apprStatus'].length - 1)]['status'] === 'Declined') {
        //   const findIndex = this.intervalHandling.findIndex(interval => interval.visitor_id === id);
        //   this.stopCheckingStatus(findIndex);
        //   this.getCurrentDateVisitorList();
        // }
        // const findIndex = this.intervalHandling.findIndex(interval => interval.visitor_id === id);
        if (findIndex >= 0) {
          if (this.intervalHandling[findIndex] != undefined) {
            this.intervalHandling[findIndex].status_counter++;
            this.statusCounter++;
            if (this.intervalHandling[findIndex].status_counter == 12) {
              this.title = "Visitor Status";
              this.showToast('error', this.title, `${visitor[0]['fields']['fName']} ${visitor[0]['fields']['lName']} 's Entry denied`);
              this.stopCheckingStatus(findIndex);
            }
          }
        }

      });
    }, 5000, id);

    this.intervalHandling.push({
      visitor_id: id,
      interval_id: this.tracking,
      status_counter: 0
    });

  }
  stopCheckingStatus(index) {
    this.statusCounter = 0;
    // this.loaderService.display(false);
    this.intervalHandling[index].interval_id
    clearInterval(this.intervalHandling[index].interval_id);
    this.intervalHandling.splice(index, 1);
    this.getCurrentDateVisitorList();
    // this.tracking = null;
  }
  public onCellDelete(data: any) {

    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    // this.activeModal.componentInstance.modalHeader = 'Large Modal';
    // this.activeModal.componentInstance.previewURLs = this.images;

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {

        const visitorId = (data.row.originalRes
          .visitorID !== undefined) ? data.row.originalRes
            .visitorID : 0;
        this._pagesService.deleteVisitor(visitorId).subscribe(
          data => {
            if (data.length > 0) {
              this.showToast(this.type, this.title, this.content);
              this.loaderService.display(false);
              this.getCurrentDateVisitorList();
            }

          },
          error => {
            this.title = "Visitor Status";
            this.showToast('error', 'Error', "Something went wrong. Please try again");
            this.loaderService.display(false);
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

        postObj.nodeType = "Facilities";
        postObj.fields = results;
        postObj.id = id;
        delete postObj['row'];
        this._pagesService.updateNode(postObj).subscribe(
          data => {
            this.title = "Facilities Update";
            this.content = "Facility updated successfully."
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/events'])
            this.getCurrentDateVisitorList();
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


  fetchVisitors() {
    let date = new Date();
    let startDates = this.startDate;
    let endDates = this.endDate;
    let postData: any = {};
    endDates.setDate(endDates.getDate() + 1)
    postData.start_date = this._globals.getDateFormat(startDates);
    postData.end_date = this._globals.getDateFormat(endDates);
    if (this.selectedOrgType != null) {
      postData['fields.fromOrg'] = this.selectedOrgType;
    }

    if (this.firstName != null) {
      postData['fName'] = this.firstName;

    }

    this.loaderService.display(true);
    this.getVisitorList(postData);
    // this.getPaymentList(postData);

  }

  onOrgTypeChange(type, value) {
    let postData: any = {};
    // postData.fields  = {};
    postData['fields.fromOrg'] = this.selectedOrgType;
    this.getVisitorList(postData);
    // console.log(this.selectedOrgType);
    // fromOrg

  }

}
