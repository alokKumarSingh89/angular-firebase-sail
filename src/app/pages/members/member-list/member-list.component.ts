import { Component } from '@angular/core';
import { PagesService } from '../../pages.service';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { NotificationModalComponent } from '../../events/modal/NotificationModal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { LinkProfileComponent } from './link-profile.component';
import { ConsultationComponent } from './consultation.component';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'member-list',
  templateUrl: 'member-list.component.html',
  styleUrls: ['./member-list.scss']
})
export class MemberListComponent {
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
  userID = "";
  firstName = "";
  lastName = "";
  userRole = [];
  userType = "";
  tableData = [];
  reverse: boolean = false;
  order: string = 'name';
  sortedCollection = [];
  currentPage: number = 1;

  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public canCreate = false;
  public canEdit = false;
  public canView = false;
  public currentOffset = 0;
  public pageLimit = 10;
  isDisplayLinked = true;
  isDisplayConsultationed = true;
  public rows: Array<any> = [];

  public constructor(private _pagesService: PagesService,
    private _modalService: NgbModal,
    private _toasterService: ToasterService,
    protected router: Router,
    private _globals: Globals,
    public loaderService: LoaderService,
    private orderPipe: OrderPipe
  ) {

    this.length = this.data.length;
    this.canCreate = _globals.canCreate('Members');
    this.canEdit = _globals.canEdit('Members');
    this.canView = _globals.canView('Members');
  }

  public ngOnInit(): void {
    this.loaderService.display(true);
    if (!this.canView) {
      this.title = "Access Denied";
      this.showToast(this.type, this.title, "You have allowed to access.");
      this.router.navigate(['/pages/dashboard']);
    }
    // this.getMembersList();
    this.searchUser({});
    this.userRole = this._globals.MEMBER_ROLE;
  }


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  public getMembersList() {
    this._pagesService.getMembers().subscribe(
      data => {
        this.data = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key];
          tempData.roleIcon = 'assets/images/user_icon.png';
          if (tempData.badge_id == undefined) {
            tempData.badge_id = "";
          }
          // badge_id
          // tempData.id = data[key].id;
          this.data.push(tempData);
          this.tableData.push(tempData);

        }
        this.sortedCollection = this.orderPipe.transform(this.tableData, 'firstName');
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
    this.router.navigate(['/pages/members/edit/' + data.userID])
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


  public onCellDelete(data: any) {
    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {
        this.loaderService.display(true);
        this._pagesService.deleteMember(data.id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.getMembersList();
          },
          error => {
            this.loaderService.display(false);
          }
        );
      }

    }, (reason) => {

    });
  }

  onCellLink(event) {
    this.activeModal = this._modalService.open(LinkProfileComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });
    this.activeModal.componentInstance.linkedProfile = Object.assign({}, event);
    console.log(event);
    this.activeModal.result.then((results) => {
      if (results === 'delete') {
        this.seachMember();
      }
    });

  }

  seachMember() {

    let postObj: any = {};

    if (this.userID !== '') {
      postObj.userID = this.userID
    }
    if (this.firstName !== '') {
      postObj.firstName = { startsWith: this.firstName };
    }

    if (this.lastName !== '') {
      postObj.lastName = { startsWith: this.lastName };
    }

    if (this.userType !== '') {
      postObj.roleType = { startsWith: this.userType };
    }


    // this.currentOffset = 0;
    postObj['limit'] = this.pageLimit;
    postObj['offset'] = this.currentOffset;

    this.searchUser(postObj);
  }

  searchUser(postObj) {

    postObj['limit'] = this.pageLimit;
    postObj['offset'] = this.currentOffset;
    this.loaderService.display(true);
    this._pagesService.searchUser(postObj).subscribe(data => {

      this.data = [];
      this.tableData = [];
      let tempData: any = {};
      for (var key in data) {
        // tempData = data[key];
        tempData = {};
        tempData.userID = data[key].userID;
        tempData.id = data[key].id;
        if (data[key].roleType !== undefined) {
          tempData.roleType = data[key].roleType;
        } else {
          tempData.roleType = '';
        }
        if (data[key].profileImageURL == undefined) {
          tempData.profileImageURL = 'assets/images/user_icon.png';
        }


        if (data[key].lastName !== undefined) {
          tempData.lastName = data[key].lastName;
        } else {
          tempData.lastName = '';
        }

        // tempData.lastName = '';
        if (data[key].fName !== undefined) {
          tempData.firstName = data[key].fName;
        }

        if (data[key].lName !== undefined) {
          tempData.lastName = data[key].lName;
        }

        if (data[key].name !== undefined) {
          tempData.firstName = data[key].name;
        }

        if (data[key].firstName !== undefined) {
          tempData.firstName = data[key].firstName;
        } else {
          tempData.firstName = '';
        }

        if (data[key].phoneno === undefined) {
          tempData.phoneno = '';
        } else {
          tempData.email = data[key].phoneno;
        }

        if (data[key].email === undefined) {
          tempData.email = '';
        } else {
          tempData.email = data[key].email;
        }

        // tempData = data[key];


        if (data[key].roleType == undefined) {
          tempData.roleIcon = "";
        } else {

          tempData.roleIcon = data[key].roleType;
        }

        // tempData.roleIcon = 'assets/images/user_icon.png';
        if (data[key].badge_id == undefined) {
          tempData.badge_id = "";
        } else {

          tempData.badge_id = data[key].badge_id;
        }
        if (tempData.phoneno == undefined) {
          tempData.phoneno = "";
        } else {
          tempData.badge_id = data[key].phoneno;
        }

        if (tempData.userID == undefined) {
          tempData.userID = "";
        } else {
          tempData.badge_id = data[key].userID;
        }
        if (data[key].linkedProfiles == undefined) {
          tempData.linkedProfiles = [];
        } else {
          tempData.linkedProfiles = data[key].linkedProfiles;
        }

        
        this.loaderService.display(false);
        this.tableData.push(tempData);
      }
      this.loaderService.display(false);
      this.sortedCollection = this.orderPipe.transform(this.tableData, 'firstName');

    }, error => {
      this.loaderService.display(false);
    });
  }

  nextPage() {
    this.currentOffset = this.currentOffset + this.pageLimit;
    let postObj = {};
    postObj['limit'] = this.pageLimit;
    postObj['offset'] = this.currentOffset;
    console.log('current obset', this.currentOffset);
    this.seachMember();
  }

  previousPage() {
    this.currentOffset = this.currentOffset - this.pageLimit;
    if (this.currentOffset <= 0) {
      this.currentOffset = 0;
    }

    let postObj = {};
    postObj['limit'] = this.pageLimit;
    postObj['offset'] = this.currentOffset;
    this.seachMember();
  }

  cellConsultation(event) {
    console.log('event', event);
    this.activeModal = this._modalService.open(ConsultationComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });
    this.activeModal.componentInstance.linkedProfile = Object.assign({}, event.row);

    this.activeModal.result.then((results) => {
      if (results === 'delete') {
        this.seachMember();
      }
    });
  }
}
