import { Component } from '@angular/core';
import { PagesService } from '../../pages.service';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { GalleryModalComponent } from '../../events/modal/galleryModal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';

@Component({
  selector: 'gallery-list',
  templateUrl: 'gallery-list.component.html',
  styleUrls:['gallery-list.component.scss']
})
export class GalleryListComponent {
  name: string;
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
  public columns: Array<any> = [
    { title: 'Title', name: 'title', filtering: { filterString: '', placeholder: 'Filter by name' } },
    {
      title: 'Short Desc',
      name: 'description',
      sort: false,
      filtering: { filterString: '', placeholder: 'Filter by short description' }
    },
    //  { title: 'Organizers', name: 'organizers',  },
    // { title: 'Event Start', name: 'eventStartTime' },
    // { title: 'Event End', name: 'eventEndTime' },
  ];

  public data: Array<any> = [];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public canCreate = false;
  public canEdit = false;
  public canView = false;
  public activeModal: NgbModalRef;
   public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered'],
   
  };
  public rows: Array<any> = [];

  constructor(private _pagesService:PagesService,private loaderService: LoaderService,private _globals:Globals,private _modalService: NgbModal,private _toasterService: ToasterService,protected router: Router) {
    this.length = this.data.length;
    this.canCreate = true;//_globals.canCreate('Albums');
    this.canEdit =  true;//_globals.canEdit('Albums');
    this.canView =  true;//_globals.canView('Albums');
    this.config.canEdit = this.canEdit;
    this.config.canGallery = true;
    
  }
  public ngOnInit(): void {
    this.loaderService.display(true);
    this.getGalleryList();
  }

  public getGalleryList(){
    this._pagesService.getNodes("Albums").subscribe(
      data => {
        this.data = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key].fields
          tempData.id = data[key].id;
          this.data.push(tempData);
        }
        this.onChangeTable(this.config);
        this.loaderService.display(false);
      },
      error => {
        this.loaderService.display(false);
      }
    );
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

    this.router.navigate(['/pages/gallery/edit/' +data.id]);
  }

  public onCellAdd(){
    this.router.navigate(['/pages/gallery/add']);
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


  public onCellDelete(data: any) {

    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });
    
    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {

        this._pagesService.deleteNode(data.row.id).subscribe(
          data => {
            this.showToast(this.type, this.title, this.content);
            this.loaderService.display(true);
            this.getGalleryList();
          },
          error => {

          }
        );
      }

    }, (reason) => {

    });
  }

  public onCellviewGallery(data: any) {
    this.activeModal = this._modalService.open(GalleryModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });
    let imageArray = [];
    for (let i = 1; i <= data.row.image_counter; i++) {
        let imgObj:any = {};
        if(data.row["image_"+i] != undefined){
          imgObj.imageUrl = data.row["image_"+i];
          imgObj.imageDesc = data.row["imgDesc_"+i]; 
          imgObj.imageIndex = i; 
        } 
        imageArray.push(imgObj);
      }

    this.activeModal.componentInstance.images = imageArray;
  }
  

}
