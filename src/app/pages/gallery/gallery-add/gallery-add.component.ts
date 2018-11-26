import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { PagesService } from '../../pages.service';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ModalComponent } from '../../events/modal/modal.component';
import { DeleteModalComponent } from '../../events/modal/deleteModal.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gallery-add',
  templateUrl: 'gallery-add.component.html',
  styleUrls: ['gallery-add.component.scss'],
})
export class GalleryAddComponent {
  galleryModal: any = {}
  toastConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'Gallery Update!';
  content = `Gallery Added Sucessfully`;
  timeout = 10000;
  toastsLimit = 5;
  type = 'default';
  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;
  public isNewUpdate = true;
  public nodeId;
  Name: string;
  public myFile: File; /* property of File type */
  imageObject;
  filedata = "";
  uploadForm;
  errorMsg = "";
  previewURLs;
  isImageUpload = false;
  imageUrl = "";
  images = [];
  public activeModal: NgbModalRef;
  imagesArray;
  previewUrlErrMsg = false;

  constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private _globals: Globals, private loaderService: LoaderService) {
    this.uploadForm = new FormGroup({
      file1: new FormControl()
    });
  }

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  ngOnInit() {

    this._pagesService.getImages().subscribe(
      data => {
        this.imagesArray = data;
      },
      error => {

      }
    );

    this.loaderService.display(true);
    this.activatedRoute.params.subscribe(params => {
      this.nodeId = params['id'];
    });

    if (this.nodeId) {
      this.getNode();
    } else {
      this.loaderService.display(false);
    }

  }


  getNode() {
    let postObj: any = {}
    this.images = [];
    postObj.nodeType = 'Albums';
    postObj.id = this.nodeId;
    this._pagesService.getNode(postObj).subscribe(
      data => {
        this.galleryModal = data[0].fields;
        this.galleryModal.id = data[0].id;
        this.galleryModal.imageDescription = "";
        this.isNewUpdate = false;
        this.loaderService.display(false);
        // console.log();

        for (let i = 1; i <= this.galleryModal.image_counter; i++) {
          let imgObj: any = {};
          if (this.galleryModal["image_" + i] != undefined) {
            imgObj.imageUrl = this.galleryModal["image_" + i];
            imgObj.imageDesc = this.galleryModal["imgDesc_" + i];
            imgObj.imageIndex = i;
            this.images.push(imgObj);
          }

        }

      },
      error => {
        this.loaderService.display(false);
      }
    );
  }


  /* Now send your form using FormData */
  onImageUpload(): void {
    this.errorMsg = "";
    let _formData = new FormData();
    _formData.append("uploadFile", this.filedata);
    let body = _formData;
    this.loaderService. display(true);
    this._pagesService.uploadImage(_formData).subscribe(
      data => {
        let images = data;
        this.imageUrl = images['url'];
        this.isImageUpload = true;
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

  submitForm() {

    if (this.isNewUpdate) {

      let postObj: any = {};

      this.loaderService.display(true);

      postObj.nodeType = "Albums";
      postObj.fields = this.galleryModal;
      postObj.fields.createdTime = this._globals.getDate();
      postObj.fields.createdBy = localStorage.getItem('email');
      postObj.fields['image_background'] = this.imageUrl;
      postObj.fields['image_1'] = this.imageUrl;
      postObj.fields['imgDesc_1'] = this.galleryModal.imageDescription;
      postObj.fields['image_counter'] = 1;
      this._pagesService.saveNode(postObj).subscribe(
        data => {
          this.loaderService.display(true);
          this.showToast(this.type, this.title, this.content);
          // this.router.navigate(['/pages/gallery'])
          // this.getNode();
          this.images = [];
          this.galleryModal = data['fields'];
          this.galleryModal.id = data['id'];
          this.galleryModal.imageDescription = "";
          this.isNewUpdate = false;
          this.loaderService.display(false);
          // console.log();
  
          for (let i = 1; i <= this.galleryModal.image_counter; i++) {
            let imgObj: any = {};
            if (this.galleryModal["image_" + i] != undefined) {
              imgObj.imageUrl = this.galleryModal["image_" + i];
              imgObj.imageDesc = this.galleryModal["imgDesc_" + i];
              imgObj.imageIndex = i;
              this.images.push(imgObj);
            }
          }

        },
        error => {
          this.loaderService.display(false);
          this.type = 'error';
          this.title = "Error";
          this.content = "Something went wrong";
          this.showToast(this.type, this.title, this.content);
          this.getNode();
        }
      );
    } else {
      let postObj: any = {}
      postObj.nodeType = "Albums";
      postObj.fields = this.galleryModal;
      postObj.id = this.galleryModal.id;
      let imageC = (this.galleryModal.image_counter + 1);
      postObj.fields['image_' + imageC] = this.imageUrl;
      postObj.fields['imgDesc_' + imageC] = this.galleryModal.imageDescription;
      postObj.fields['image_counter'] = (imageC);
      // console.log(postObj);
      // if(postObj.fields.image_background == undefined){
      //   postObj.fields['image_background'] = postObj.fields['image_3'];
      // }


      this.content = "Gallery stored successfully."
      this._pagesService.updateNode(postObj).subscribe(
        data => {
          this.showToast(this.type, this.title, this.content);
          // this.router.navigate(['/pages/gallery'])
          this.images = [];
          this.galleryModal = data[0]['fields'];
          this.galleryModal.id = data[0]['id'];
          this.galleryModal.imageDescription = "";
          this.isNewUpdate = false;
          this.loaderService.display(false);
          for (let i = 1; i <= this.galleryModal.image_counter; i++) {
            let imgObj: any = {};
            if (this.galleryModal["image_" + i] != undefined) {
              imgObj.imageUrl = this.galleryModal["image_" + i];
              imgObj.imageDesc = this.galleryModal["imgDesc_" + i];
              imgObj.imageIndex = i;
              this.images.push(imgObj);
            }
          }
        },
        error => {
          this.type = 'error';
          this.title = "Error";
          this.content = "Something went wrong";
          this.showToast(this.type, this.title, this.content);
        }
      );
    }
  }

  previewUrlModal() {
    this.activeModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

    this.activeModal.componentInstance.modalHeader = 'Large Modal';
    this.activeModal.componentInstance.previewURLs = this.imagesArray;

    this.activeModal.result.then((results) => {
      if (results != undefined) {
        this.imageUrl = results.url;
        // this.previewUrlErrMsg = "";
        this.isImageUpload = true;
      } else {
        // this.previewUrlErrMsg = "required";
      }

    }, (reason) => {

      // this.previewUrlErrMsg = "required";
    });
  }

  deleteImage(image) {
    
    this.activeModal = this._modalService.open(DeleteModalComponent, {
      size: 'sm',
      backdrop: 'static',
      container: 'nb-layout',
    });

    this.activeModal.result.then((results) => {
      if (results != undefined && results != 'yes') {
        this.loaderService.display(true);
        delete this.galleryModal['image_' + image.imageIndex];
        delete this.galleryModal['imgDesc_' + image.imageIndex];

        let postObj: any = {}
        postObj.nodeType = "Albums";
        postObj.fields = this.galleryModal;
        postObj.id = this.galleryModal.id;

        this.content = "Image deleted successfully."
        this._pagesService.updateNode(postObj).subscribe(
          data => {
            
            this.showToast(this.type, this.title, this.content);
            // this.router.navigate(['/pages/gallery'])
            this.getNode();
          },
          error => {
            this.loaderService.display(false);
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

}

