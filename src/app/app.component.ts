/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';


@Component({
  selector: 'ngx-app',
  template: '   <router-outlet> <div *ngIf="showLoader" class="loading"></div> </router-outlet>',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  showLoader: boolean = false;

  constructor( private loaderService: LoaderService) {

  }

  ngOnInit(): void {
   
  }

  ngAfterViewInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
  });
}

}
