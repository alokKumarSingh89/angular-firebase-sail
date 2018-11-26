import { Component, OnInit } from "@angular/core";
// import { EventModel } from './../../event.model';
import { PagesService } from "../../pages.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../events/modal/modal.component";
import { ThumbnailModalComponent } from "../../events/modal/thumbnailModal.component";
import "./ckeditor.loader";
import "ckeditor";
import {
  ToasterService,
  ToasterConfig,
  Toast,
  BodyOutputType
} from "angular2-toaster";
import "style-loader!angular2-toaster/toaster.css";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Globals } from "../../../globals";
import { LoaderService } from "../../../loader.service";
import { DataService } from "../../../data.service";
@Component({
  selector: "add-event",
  templateUrl: "./booking-add.component.html",
  styleUrls: ["./booking-add.component.scss"]
})
export class BookingAddComponent implements OnInit {
  public bookingModel: any = {};

  public images: any;
  // public activeModal;
  public activeModal: NgbModalRef;
  private activeThumnailModal: NgbModalRef;
  public thumbnailErrMsg = "";
  public previewUrlErrMsg = "";
  toastConfig: ToasterConfig;
  position = "toast-top-right";
  animationType = "fade";
  title = "Booking Update!";
  content = `Event Added Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = "default";
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  public isNewUpdate = true;
  public nodeId;
  public facilities: any = [];
  public displayPart;

  constructor(
    private _pagesService: PagesService,
    private _modalService: NgbModal,
    private _toasterService: ToasterService,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private _globals: Globals,
    private loaderService: LoaderService,
    private dataService: DataService
  ) {
    this.bookingModel.facilityID = "";
    this.dataService.bookingType.subscribe(res => (this.displayPart = res));
    console.log("display type>>", this.displayPart);
  }

  ngOnInit() {
    this.getFacilities();

    this.activatedRoute.params.subscribe(params => {
      this.nodeId = params["id"];
    });

    if (this.nodeId) {
      let postObj: any = {};
      postObj.nodeType = "Bookings";
      postObj.id = this.nodeId;
      this._pagesService.getNode(postObj).subscribe(
        data => {
            console.log("data", data);
          if (data[0] !== undefined) {
            this.bookingModel = data[0].fields;
            this.bookingModel.id = data[0].id;
            this.bookingModel.bookingID = data[0].bookingID;
            this.isNewUpdate = false;
            this.loaderService.display(false);
          }
        },
        error => {
          this.loaderService.display(false);
        }
      );
    } else {
      this.loaderService.display(false);
    }
  }

  private showToast(type: string, title: string, body: string) {
    this.toastConfig = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml
    };
    this._toasterService.popAsync(toast);
  }

  clearToasts() {
    this._toasterService.clear();
  }

  previewUrlModal() {
    this.activeModal = this._modalService.open(ModalComponent, {
      size: "lg",
      container: "nb-layout"
    });

    this.activeModal.componentInstance.modalHeader = "Large Modal";
    this.activeModal.componentInstance.previewURLs = this.images;

    this.activeModal.result.then(
      results => {
        if (results != undefined) {
          console.log(results);
          this.bookingModel.previewURL = results.url;
          this.previewUrlErrMsg = "";
        } else {
          this.previewUrlErrMsg = "required";
        }
      },
      reason => {
        this.previewUrlErrMsg = "required";
      }
    );
  }

  thumbnailURLModal() {
    this.activeThumnailModal = this._modalService.open(ModalComponent, {
      size: "lg",
      container: "nb-layout"
    });

    this.activeThumnailModal.componentInstance.modalHeader = "Large Modal";
    this.activeThumnailModal.componentInstance.previewURLs = this.images;

    if (this.bookingModel.thumbnailURL != undefined) {
      this.activeThumnailModal.componentInstance.selectedImageId = this.bookingModel.thumbnailURL.id;
    }

    this.activeThumnailModal.result.then(
      results => {
        if (results != undefined) {
          this.bookingModel.thumbnailURL = results.url;
          this.thumbnailErrMsg = "";
        } else {
          this.thumbnailErrMsg = "required";
        }
      },
      reason => {
        this.thumbnailErrMsg = "required";
      }
    );
  }

  submitForm() {
    if (this.isNewUpdate) {
      let postObj: any = {};
      postObj.nodeType = "Bookings";
      postObj.fields = this.bookingModel;
      let currentMiliS = this._globals.getDateMilliSecond();
      postObj.bookingID = "BOOK_" + currentMiliS;
      postObj.bookingType = "Facility";
      postObj.enterpriseID = "steve2church@gmail.com";
      postObj.userEmail = "steve2church@gmail.com";
      postObj.fields.approved = true;
      // postObj.facilityID = "FACLT_" + currentMiliS;
      this._pagesService.saveNode(postObj).subscribe(
        data => {
          this.showToast(this.type, this.title, this.content);
          this.router.navigate(["/pages/bookings"]);
        },
        error => {
          this.type = "error";
          this.title = "Error";
          this.content = "Something went wrong";
          this.showToast(this.type, this.title, this.content);
        }
      );
    } else {
      let postObj: any = {};
      postObj.nodeType = "Bookings";
      postObj.fields = this.bookingModel;
      postObj.id = this.bookingModel.id;
      this.content = "Bookings stored successfully.";
      this._pagesService.updateNode(postObj).subscribe(
        data => {
          this.showToast(this.type, this.title, this.content);
          this.router.navigate(["/pages/bookings"]);
        },
        error => {
          this.type = "error";
          this.title = "Error";
          this.content = "Something went wrong";
          this.showToast(this.type, this.title, this.content);
        }
      );
    }
  }

  public getFacilities() {
    this.loaderService.display(true);
    this._pagesService.getNodes("Facilities").subscribe(
      data => {
        this.facilities = [];
        let tempData: any = {};
        for (var key in data) {
          tempData = data[key].fields;
          tempData.bookingAmount = String(data[key].fields.bookingAmount);
          tempData.id = data[key].id;
          this.facilities.push(tempData);
        }
        console.log(this.facilities);
        this.loaderService.display(false);
      },
      error => {
        this.loaderService.display(false);
      }
    );
  }
}
