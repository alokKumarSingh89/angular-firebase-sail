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
import { ModalPaymentComponent } from './modal-payment.component';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'payment-list',
  templateUrl: 'payment-list.component.html',
  styleUrls: ['./payment-list.scss']
})
export class PaymentListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Payment Delete!';
  content = `Payment Deleted Sucessfully`;
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
  startDate: any;
  endDate: any;
  tableData = [];
  reverse: boolean = false;
  order: string = 'name';
  sortedCollection = [];
  currentPage: number = 1;

  public columns: Array<any> = [
    { title: 'User Id', name: 'user_id', filtering: { filterString: '', placeholder: 'Filter by user id' } },
    {
      title: 'User Email',
      name: 'user_email',
      sort: false,
      filtering: { filterString: '', placeholder: 'Filter by User Email' },
    },
    { title: 'Due Date', name: 'dueDate' },
    { title: 'Amout', name: 'amount_cur' },
    { title: 'Status', name: 'status' },


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

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService, private orderPipe: OrderPipe) {
    this.length = this.data.length;
    this.canCreate = true;//_globals.canCreate('Facilities');
    this.canEdit = false;//_globals.canEdit('Facilities');
    this.canView = true;//_globals.canView('Facilities');
    this.config.canEdit = false;
    this.config.canSendNotification = true;
  }

  public ngOnInit(): void {
    this.loaderService.display(true);
    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }


    let date = new Date();
    let startDates = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDates = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let postData: any = {};
    postData.start_date = this._globals.getDateFormat(startDates);
    postData.end_date = this._globals.getDateFormat(endDates);


    this.getPaymentList(postData);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  public getPaymentList(params) {
    this._pagesService.getPayments(params).subscribe(
      data => {
        this.data = [];
        this.tableData =[];
        data = data['payments'];

        let tempData: any = {};
        for (var key in data) {
          tempData = data[key];
          tempData['dueDate'] = new Date((data[key]['due_date'])).toDateString();
          tempData['amount_cur'] = data[key]["amount"] + " | " + data[key]["currency"]
          this.data.push(tempData);
          this.tableData.push(tempData);
        }
        this.onChangeTable(this.config);
        this.sortedCollection = this.orderPipe.transform(this.tableData, 'name');
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
    this.router.navigate(['/pages/facilities/edit/' + data.row.id])
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

        this._pagesService.deleteNode(data.row.id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.loaderService.display(false);
            this.getPaymentList({});
          },
          error => {

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
            this.getPaymentList({});
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

  uploadPaymentFile() {

    this.activeModal = this._modalService.open(ModalPaymentComponent, { size: 'lg', container: 'nb-layout' });

    this.activeModal.componentInstance.modalHeader = 'Large Modal';
    // this.activeModal.componentInstance.previewURLs = this.images;

    this.activeModal.result.then((results) => {
      if (results != undefined) {
        // this.notificationModel.previewURL = results.url;
        // this.previewUrlErrMsg = "";
        // this.renderer.addClass(document.body, 'modal-open');
      } else {
        // this.previewUrlErrMsg = "required";
        // this.renderer.addClass(document.body, 'modal-open');
      }

    }, (reason) => {

      // this.previewUrlErrMsg = "required";
      // this.renderer.addClass(document.body, 'modal-open');
    });

  }

  fetchPayments() {
    let date = new Date();
    let startDates = this.startDate;
    let endDates = this.endDate;
    let postData: any = {};
    postData.start_date = this._globals.getDateFormat(startDates);
    postData.end_date = this._globals.getDateFormat(endDates);
    this.getPaymentList(postData);

  }
}
