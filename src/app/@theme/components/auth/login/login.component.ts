/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Globals } from '../../../../globals';
import { UserService } from '../../../../@core/data/users.service';
import { LoaderService } from '../../../../loader.service';


@Component({
  selector: 'nb-login',
  template: `
    
      <h2 class="title">Sign In</h2>
      <small class="form-text sub-title">Hello! Sign in with your username or email</small>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">
      
        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-email" class="sr-only">Email address</label>
          <input name="email" [(ngModel)]="user.email" id="input-email" pattern=".+@.+\..+"
                 class="form-control" placeholder="Email address" #email="ngModel"
                 [class.form-control-danger]="email.invalid && email.touched" autofocus
                 required 
                 >
          <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
            Email is required!
          </small>
          <small class="form-text error"
                 *ngIf="email.invalid && email.touched && email.errors?.pattern">
            Email should be the real one!
          </small>
        </div>

        <div class="form-group">
          <label for="input-password" class="sr-only">Password</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="Password" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched" required>
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            Password is required!
          </small>

        </div>

        <div class="form-group accept-group col-sm-12">
         
          <a class="forgot-password" href="https://nuhabits.co/#!/forgotpassword/landing">Forgot Password?</a>
        </div>

        <button [disabled]="!form.valid" class="btn btn-block btn-hero-success"
                >
          Sign In
        </button>
      </form>

      <div class="links">
      </div>
  `,

})
export class NgxLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;

  constructor(
    protected router: Router,
    private http: HttpClient,
    private globals: Globals,
    private userService: UserService,
    private loaderService: LoaderService
  ) { }


  // Logi 
  setUserForApi() {
    // this.user.email = "dementiaapp001@gmail.com";
    // this.user.password = 'test123';
    let apiUser = {email:"dementiaapp001@gmail.com",password:'test123'}
    this.http.post(this.globals.API_URL + "/login", this.user)
      .subscribe(
        res => {
          if (res['email'] != undefined) {
            // localStorage.setItem('email_verification', res['email_verification']);
            localStorage.setItem('name', res['name']);
            localStorage.setItem('sToken', res['sToken']);
            localStorage.setItem('viewAccess', JSON.stringify(res['viewAccess']));
            localStorage.setItem('access_token', res['token']['access_token']);
            this.loaderService.display(false);
            this.router.navigate(['pages/dashboard']);
            
          } else {
            this.showMessages.error = true;
            this.loaderService.display(false);
            this.errors = ["Can't access, contact the admin"];
          }
        },
        err => {
          this.showMessages.error = true;
          this.loaderService.display(false);
          this.errors = ["Can't access, contact the admin"];
        }
      );
  }
  login(): void {
    this.user.userType = "admin";
    this.user.adminType = "enterprise";
    this.user.parentEmail = "";
    this.loaderService.display(true);
    this.userService.loginUsingFirebase(this.user).then(data => {
      localStorage.setItem('email', data['email']);
      this.setUserForApi();
    }).catch(error => {
      this.loaderService.display(false);
      this.showMessages.error = true;
      this.errors = [error['message']];
    })

    // console.log(data)
    // localStorage.setItem('email', data['email']);
    // localStorage.setItem('sToken', data['refreshToken']);
    // this.router.navigate(['pages/dashboard']);


  }

}
