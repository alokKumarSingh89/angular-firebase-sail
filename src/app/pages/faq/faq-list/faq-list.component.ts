import { Component } from '@angular/core';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'faq-list',
  templateUrl: 'faq-list.component.html',
  styleUrls: ['./faq-list.scss']
})
export class FaqListComponent {
  name: string;
  public data: Array<any> = [];
  public activeModal: NgbModalRef;
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Faq Delete!';
  content = `Faq Deleted Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;

  tableData = [];
  reverse: boolean = false;
  order: string = 'category';
  sortedCollection = [];

  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public canCreate = false;
  public canEdit = false;
  public canView = false;
  currentPage: number = 1;

  public constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private _globals: Globals, private loaderService: LoaderService, private orderPipe: OrderPipe) {
    this.length = this.data.length;
    this.canCreate = _globals.canCreate('FAQ');
    this.canEdit = _globals.canEdit('FAQ');
    this.canView = _globals.canView('FAQ');


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


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
  public getEventList() {
    this._pagesService.getFaq({}).subscribe(
      data => {
        let tempData: any = {};
        this.tableData = [];
        for (var key in data) {
          tempData = data[key].fields;
          tempData.faqID = data[key].faqID;
          tempData.id = data[key].id;
          tempData.answer = tempData.answer.substring(0, 175);
          this.tableData.push(tempData);
        }
        this.sortedCollection = this.orderPipe.transform(this.tableData, 'category');
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
    this.router.navigate(['/pages/faq/edit/' + data.faqID])
  }



  public onCellDelete(data: any) {

    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {

        this._pagesService.deleteFaq(data.faqID).subscribe(data => {
          this.showToast(this.type, this.title, this.content);
          this.loaderService.display(true);
          this.getEventList();
        })
      }

    }, (reason) => {

    });
  }

}
