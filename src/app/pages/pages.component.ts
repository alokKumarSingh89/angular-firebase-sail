import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { PagesService } from './pages.service';
import { FileUploadModule } from "ng2-file-upload"; 

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
  providers: [PagesService]
})
export class PagesComponent {

  // menu = MENU_ITEMS;
  menu;
  constructor(private _pagesService: PagesService) {

  }

  ngOnInit() {
    this.menu = this._pagesService.getMenu();
  }
}
