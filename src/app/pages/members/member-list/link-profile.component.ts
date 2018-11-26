import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from '../../../globals';
import { FormControl, FormGroup } from '@angular/forms';
import { PagesService } from '../../pages.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { NgForm } from '@angular/forms';
import { LoaderService } from '../../../loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-link-modal',
  templateUrl: `link-profile.component.html`,
})
export class LinkProfileComponent implements OnInit {

  modalHeader: string;
  linkedProfile: any = {};
  profileList: any = [];
  selectedProfile: any = {};
  isDisplayConsulation: any = false;
  linkProfileModel: any = {};
  consulationType: any = [];
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
  selectedLinkedProfile: any = {};
  consultationList = [];

  public data: Array<any> = [];

  @ViewChild('form') myForm: NgForm;

  public columns: Array<any> = [
    { title: 'Date', name: 'created' },
    { title: 'Type', name: 'type' },
    { title: 'Notes', name: 'notes' }
  ];

  // public linkedColumns: Array<any> = [
  //   { title: 'First Name', name: 'firstName' },
  //   { title: 'Last Name', name: 'lastName' }
  // ];


  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    // filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered'],

  };


  ngOnInit(): void {
    this.getConsultation();
    // console.log(this.linkedProfile.linkedProfiles);
    if (this.linkedProfile.linkedProfiles !== undefined) {
      // this.linkedProfile.linkedProfiles
      // this.data = this.linkedProfile.linkedProfiles;
      // this.onChangeTable(this.config);
    }

  }

  public rows: Array<any> = [];

  constructor(public activeModal: NgbActiveModal, private _globals: Globals, private _pagesService: PagesService, private _toasterService: ToasterService, public loaderService: LoaderService, protected router: Router) {
    this.consulationType = _globals.CONSULATION_TYPE;
    this.config.canEdit = true;
  }

  /* Now send your form using FormData */
  onSubmit(): void {

  }

  closeModal() {
    this.activeModal.close();
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


  toggleAccordian(event) {
    // searchUser
    this.loaderService.display(true);
    const selectedIndex = this.profileList.findIndex(profile => profile.userID == event.panelId);

    if (selectedIndex >= 0) {
      this.selectedProfile = this.profileList[selectedIndex];
      this.loaderService.display(false);
    } else {
      const searchParm = {
        "userID": event.panelId
      }
      this._pagesService.searchUser(searchParm).subscribe(res => {
        console.log(res);
        this.profileList.push(res[0]);
        this.selectedProfile = res[0];
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
      console.log('event', event);
    }
  }

  openConsulation(member) {
    this.isDisplayConsulation = true;
    this.selectedLinkedProfile = member;
    console.log('member', member);
  }

  submitForm() {
    let postRes: any = {};
    postRes['fields'] = this.linkProfileModel;
    postRes.userID =  this.linkedProfile.userID;

    if (this.linkProfileModel.consultationID !== undefined) {
      postRes.consultationID = this.linkProfileModel.consultationID;
      const index = this.consultationList.findIndex(cons => cons.consultationID === this.linkProfileModel.consultationID);
      if (index >= 0) {
        const constObj = this.consultationList[index];
        constObj.fields = this.linkProfileModel;
        this._pagesService.updateConsultation(constObj).subscribe(response => {
          this.title = "Consultation Update";
          this.content = "Consultation updated successfully."
          this.showToast(this.type, this.title, this.content);
          this.getConsultation();
          this.myForm.reset();
        }, error => {

        });
      }
    } else {
      this.loaderService.display(true);
      this._pagesService.saveConsultation(postRes).subscribe(response => {
        this.title = "Consultation Update";
        this.content = "Consultation added successfully."
        this.showToast(this.type, this.title, this.content);
        this.getConsultation();
        this.myForm.reset();
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(true);
      });
    }

  }


  getConsultation() {
    let searchParm: any = {};
    searchParm['userID'] = this.linkedProfile.userID;
    searchParm['fields.type'] = "prescription";
    this._pagesService.getConsultations(searchParm).subscribe(res => {
      // console.log(request);
      this.consultationList = res;
      this.data = [];
      let tempData: any = {};
      for (var key in res) {
        tempData = res[key].fields;
        tempData.consultationID = res[key].consultationID;
        tempData.consultationTS = res[key].consultationTS;
        tempData.created = new Date((res[key]['createdAt'])).toDateString();
     
        this.data.push(tempData);
      }
      this.onChangeTable(this.config);
      // this.loaderService.display(false);
    }, error => {

    })
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


  onCellEdit(event) {
    console.log('event0', event);
    this.linkProfileModel = event.row;
    this.selectedLinkedProfile = event.row;
  }

  onCellDelete(event) {
    this.loaderService.display(true);
    this._pagesService.deleteConsultation(event.row.consultationID).subscribe(response => {
      this.title = "Consultation Update";
      this.content = "Consultation deleted successfully."
      this.showToast(this.type, this.title, this.content);
      this.getConsultation();
      this.myForm.reset();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }



  displayList() {
    this.isDisplayConsulation = false
    this.linkProfileModel = {};
    this.selectedLinkedProfile = {};
  }

  clearForm() {
    this.linkProfileModel = {};
    this.selectedLinkedProfile = {};
    this.myForm.reset();
  }

  editUser(row) {
    this.activeModal.close();
    this.router.navigate(['/pages/members/edit/' + row.userID])
  }


  deleteUser(row) {
    this.loaderService.display(true);
    this.activeModal.close('delete');
    this._pagesService.deleteMember(row.userId).subscribe(
      data => {
        this.showToast(this.type, this.title, "Linked Profile deleted successfully");
        this.activeModal.close('delete');
       
      },
      error => {
        this.loaderService.display(false);
      }
    );
  }
}
