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
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'update-list',
  templateUrl: 'update-list.component.html',
  styleUrls: ['./update-list.scss']
})
export class UpdateListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Update Delete!';
  content = `Update Deleted Sucessfully`;
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
  currentPage: number = 1;
  
  tableData = [];
  reverse: boolean = false;
  order: string = 'name';
  sortedCollection = [];

  public columns: Array<any> = [
    { title: 'Name', name: 'name', filtering: { filterString: '', placeholder: 'Filter by name' } },
    {
      title: 'Short Desc',
      name: 'shortDesc',
      sort: false,
      filtering: { filterString: '', placeholder: 'Filter by short description' }
    },

    { title: 'WebURL', name: 'webURL', filtering: { filterString: '', placeholder: 'Filter by Web URL' } },

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
    className: ['table-striped', 'table-bordered'],
  };

  public rows: Array<any> = [];

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService, public orderPipe: OrderPipe) {
    this.length = this.data.length;
    this.canCreate = _globals.canCreate('Updates');
    this.canEdit = _globals.canEdit('Updates');
    this.canView = _globals.canView('Updates');
    this.loaderService.display(true);
  }

  public ngOnInit(): void {

    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }

    this.getUpdatesList();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  public getUpdatesList() {
    this._pagesService.getNodes('Updates').subscribe(
      data => {
        this.tableData = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key].fields
          tempData.id = data[key].id;
          if (tempData.webURL === undefined) {
            tempData.webURL = '';
          }

          this.tableData.push(tempData);
        }

        this.loaderService.display(false);
        this.sortedCollection = this.orderPipe.transform(this.tableData, 'name');
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


  public onCellClick(data: any): any {

  }

  public onCellEdit(data: any) {
    this.router.navigate(['/pages/updates/edit/' + data.id])
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

        this._pagesService.deleteNode(data.id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.loaderService.display(true);
            this.getUpdatesList();
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
    this.activeModal.componentInstance.notificationModel = Object.assign({}, data);

    var id = data.id;
    this.activeModal.result.then((results) => {

      let postObj: any = {}
      postObj = data;
      if (results != undefined && results != 'yes') {

        postObj.nodeType = "Updates";
        postObj.fields = results;
        postObj.id = id;
        this._pagesService.updateNode(postObj).subscribe(
          data => {
            this.title = "Updates Update";
            this.content = "Updates updated successfully."
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/events'])
            this.getUpdatesList();
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


}
