import { Component } from '@angular/core';
import { PagesService } from '../../pages.service';
import { DeleteModalComponent } from '../modal/deleteModal.component';
import { NotificationModalComponent } from '../modal/NotificationModal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'event-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['./event-list.scss']
})
export class EventListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Event Delete!';
  content = `Event Deleted Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  canSendNotification = true;
  tableData = [];
  reverse: boolean = false;
  order: string = 'name';
  sortedCollection = [];

  public canCreate = false;
  public canEdit = false;
  public canView = false;


  public rows: Array<any> = [];
  currentPage: number = 1;

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService, private orderPipe: OrderPipe) {
    this.canCreate = _globals.canCreate('Events');
    this.canEdit = _globals.canEdit('Events');
    this.canView = _globals.canView('Events');

  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  public ngOnInit(): void {
    this.loaderService.display(true);
    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }
    this.getEventList();
  }



  public getEventList() {
    this._pagesService.getNodes("Events").subscribe(
      data => {
        this.data = [];
        this.tableData = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key].fields
          tempData.id = data[key].id;
          this.data.push(tempData);
          this.tableData.push(tempData);

        }
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

  public onCellClick(data: any): any {

  }

  public onCellEdit(data: any) {
    this.router.navigate(['/pages/events/edit/' + data.id])
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
            this.getEventList();
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


  public onCellDelete(data: any) {

    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {

        this._pagesService.deleteNode(data.id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.loaderService.display(true);
            this.getEventList();
          },
          error => {

          }
        );
      }

    }, (reason) => {

    });
  }

}
