import {Component} from '@angular/core';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from '../../@theme/modules/ng2-table/ng2-table';
import { Ng2TableModule } from '../../@theme/modules/ng2-table/ng2-table';

@Component({
  selector: 'gallery',
  styles: [],
  template: `<router-outlet></router-outlet>`
})
export class GalleryComponent {

  constructor() {
  }

}
