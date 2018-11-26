/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../../../../globals';

@Component({
  selector: 'nb-logout',
  template: `
    <div>Logging out, please wait...</div>
  `,
})
export class NgxLogoutComponent implements OnInit {

  redirectDelay: number = 0;
  provider: string = '';


  constructor(protected router: Router,private globals: Globals) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.globals.logoutUser();
    this.logout(this.provider);
  }

  logout(provider: string): void {

      setTimeout(() => {
        return this.router.navigateByUrl("auth/login");
      }, this.redirectDelay);
    }


}
