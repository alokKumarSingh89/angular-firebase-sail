import { Component, OnInit } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { PagesService } from '../../pages.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoaderService } from '../../../loader.service';
import { LocationStrategy } from '../../../../../node_modules/@angular/common';
import { Globals } from '../../../globals';

@Component({
  selector: 'add-payment-configuration',
  templateUrl: './add-payment-configuration.component.html',
  styleUrls: ['./add-payment-configuration.component.css']
})
export class AddPaymentConfigurationComponent implements OnInit {

  // toast configuration variables
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

  selectedPaymentMethod: any = 'payumoney';           // setting default payment configuration

  userPaymentConfigurations: any[] = [];

  testPaymentConfigurationExist: boolean = false;          // flag to check if payment configuration exist or not
  productionPaymentConfigurationExist: boolean = false;

  // payment method array
  public paymentMethods = [
    { type: 'payumoney', title: 'PayUMoney' },
    { type: 'razorpay', title: 'Razor Pay' },
  ];

  paymentConfiguration_test: any;
  paymentConfiguration_production: any;

  payumoneyForm_test: FormGroup;
  razorpayForm_test: FormGroup;

  payumoneyForm_production: FormGroup;
  razorpayForm_production: FormGroup;

 
  canEdit = false;

  /**
   * Default class constructor
   * @param _toasterService 
   */
  constructor(
    private _toasterService: ToasterService,
    private pageService: PagesService,
    private _fb: FormBuilder,
    private _loaderService: LoaderService,
    private _globals: Globals
  ) {

    this.canEdit = _globals.canEdit('Payment Config');
   
  }

  ngOnInit() {

    this.paymentConfiguration_production = {
      "fields": {
        "type": "payumoney",
        "merchant_key": "",
        "merchant_salt": "",
        "auth_header": "",
        "success_url": "",
        "failure_url": "",
        "mode": "production"
      }
    };

    this.paymentConfiguration_test = {
      "fields": {
        "type": "payumoney",
        "merchant_key": "",
        "merchant_salt": "",
        "auth_header": "",
        "success_url": "",
        "failure_url": "",
        "mode": "development"
      }
    };

    this.payumoneyForm_test = this._fb.group({
      merchant_key: ['', Validators.required],
      merchant_salt: ['', Validators.required],
      auth_header: [''],
      success_url: [''],
      failure_url: ['']
    });

    this.payumoneyForm_production = this._fb.group({

      merchant_key: ['', Validators.required],
      merchant_salt: ['', Validators.required],
      auth_header: [''],
      success_url: [''],
      failure_url: ['']
    });

    this.razorpayForm_test = this._fb.group({
      key_id: ['', Validators.required],
      key_secret: ['', Validators.required]
    });

    this.razorpayForm_production = this._fb.group({
      key_id: ['', Validators.required],
      key_secret: ['', Validators.required]
    });

    
    // if user is not allowed to edit payment configuration then disable it
    if(!this.canEdit){
      this.payumoneyForm_test.disable();
      this.payumoneyForm_production.disable();
      this.razorpayForm_test.disable();
      this.razorpayForm_production.disable();
    }
   
    // fetching payment configurations
    this.getPaymentConfiguration();
  }

  /**
   * Callback when payment method changes
   */
  onPaymentMethodChange() {
    this.getPaymentConfiguration();
  }

  /**
   * Function to save payment configuration
   */
  savePaymentConfiguration(type) {

    this._loaderService.display(true);

    let operation_type = 'CREATE';
    let postData;

    // checking if configuration is for test mode or production mode
    if (type === 'test') {

      // if test payment configuration for current payment type exist then perform UPDATE only
      if (this.testPaymentConfigurationExist) {
        operation_type = 'UPDATE';
      }
      else {
        // if not create new one
        operation_type = 'CREATE';
      }

      postData = this.paymentConfiguration_test;
    }
    else {

       // if test production configuration for current payment type exist then perform UPDATE only
       // else create new production configuration for current payment type
      if (this.productionPaymentConfigurationExist) {
        operation_type = 'UPDATE';
      }
      else {
        operation_type = 'CREATE';
      }

      postData = this.paymentConfiguration_production;
    }

    // updating or creating configuation
    if (operation_type === 'UPDATE') {

      let data = {
        "fields": postData.fields
      }

      // making update API call to update existing payment configuration
      this.pageService.updatePaymentConfiguration(data, postData.id).subscribe((res) => {
        this.type = 'default';
        this.title = "Successfull";
        this.content = "Payment Configuration Updated Sucessfully";
        this.showToast(this.type, this.title, this.content);
        this._loaderService.display(false);
        this.getPaymentConfiguration();
      },
        (error) => {
          this._loaderService.display(false);
          this.type = 'error';
          this.title = "Error";
          this.content = "Something went wrong. Please Try Again";
          this.showToast(this.type, this.title, this.content);
        });
    }
    else {

      // making API call to create payment configuration
      this.pageService.createPaymentConfiguration(postData).subscribe((res) => {
        this._loaderService.display(false);
        this.type = 'default';
        this.title = "Successfull";
        this.content = "Payment Configuration Added Sucessfully";
        this.showToast(this.type, this.title, this.content);

        this.getPaymentConfiguration();
      },
        (error) => {
          this._loaderService.display(false);
          this.type = 'error';
          this.title = "Error";
          this.content = "Something went wrong. Please Try Again";
          this.showToast(this.type, this.title, this.content);
        });
    }

  }

  /**
   * Function to add payment configuration
   */
  getPaymentConfiguration() {

    this._loaderService.display(true);

    let postData = {
      "fields.type": this.selectedPaymentMethod,
      "userEmail": localStorage.getItem('email'),
      "offset": 0,
      "limit": 10
    }

    this.pageService.getPaymentConfiguration(postData).subscribe((data) => {

      // if payment configuration foound
      if (data !== undefined && data.length > 0) {
        this.userPaymentConfigurations = data;
        this.reloadPaymentConfiguration();
      }
      else {
        this.reloadPaymentConfiguration();
      }

      this._loaderService.display(false);

    }, (error) => {

      this._loaderService.display(false);

      this.type = 'error';
      this.title = "Error";
      this.content = "Something went wrong";
      this.showToast(this.type, this.title, this.content);

    });

  }

  /**
   * Function to load payment configuration
   */
  reloadPaymentConfiguration() {

    // checking if payment configuration exist or not
    let config_production = this.userPaymentConfigurations.find(conf => conf.fields.type === this.selectedPaymentMethod && conf.fields.mode === 'production');
    let config_test = this.userPaymentConfigurations.find(conf => conf.fields.type === this.selectedPaymentMethod && conf.fields.mode === 'development');

    // if config_production with current selected payment type found
    if (config_production !== undefined) {
      //this.paymentConfiguration_production = config_production;
      Object.assign(this.paymentConfiguration_production, {});
      Object.assign(this.paymentConfiguration_production, config_production);
      this.productionPaymentConfigurationExist = true;
    }
    else {

      this.productionPaymentConfigurationExist = false;

      if (this.selectedPaymentMethod === 'payumoney') {

        this.paymentConfiguration_production = {
          "fields": {
            "type": "payumoney",
            "merchant_key": "",
            "merchant_salt": "",
            "auth_header": "",
            "success_url": "",
            "failure_url": "",
            "mode": "production"
          }
        };

      }
      else {
        this.paymentConfiguration_production = {
          "fields": {
            "type": "razorpay",
            "key_id": "",
            "key_secret": "",
            "mode": "production",
          }
        };
      }
    }


    // for test configuration

    // if config_production with current selected payment type found
    if (config_test !== undefined) {
      //this.paymentConfiguration_test = config_test;
      Object.assign(this.paymentConfiguration_test, {});
      Object.assign(this.paymentConfiguration_test, config_test);
      this.testPaymentConfigurationExist = true;
    }
    else {

      this.testPaymentConfigurationExist = false;

      if (this.selectedPaymentMethod === 'payumoney') {

        this.paymentConfiguration_test = {
          "fields": {
            "type": "payumoney",
            "merchant_key": "",
            "merchant_salt": "",
            "auth_header": "",
            "success_url": "",
            "failure_url": "",
            "mode": "development"
          }
        };

      }
      else {
        this.paymentConfiguration_test = {
          "fields": {
            "type": "razorpay",
            "key_id": "",
            "key_secret": "",
            "mode": "development",
          }
        };
      }
    }
  }


  /**
   * Function for showing toast alerts
   * @param type 
   * @param title 
   * @param body 
   */
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

  /**
   * Function for clearning toast
   */
  clearToasts() {
    this._toasterService.clear();
  }

}
