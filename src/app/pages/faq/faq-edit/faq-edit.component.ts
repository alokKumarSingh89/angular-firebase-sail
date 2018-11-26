import { Component, OnInit } from '@angular/core';
// import { faqModel } from './../../event.model';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import './ckeditor.loader';
import 'ckeditor';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Globals } from '../../../globals';
import { LoaderService } from '../../../loader.service';
import { isNull } from 'util';
import { isEmpty } from '@firebase/util/dist/esm/src/obj';

@Component({
    selector: 'ngx-edit-faq',
    templateUrl: './faq-edit.component.html',
    styleUrls: ['./faq-edit.component.scss'],
})
export class FaqEditComponent implements OnInit {

    public faqModel: any = {};
    toastConfig: ToasterConfig;
    position = 'toast-top-right';
    animationType = 'fade';
    title = 'Faq Update!';
    content = `Faq Added Sucessfully`;
    timeout = 10000;
    toastsLimit = 5;
    type = 'default';
    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;
    public isNewUpdate = true;
    public nodeId;
    public faq: any = {};

    constructor(private _pagesService: PagesService, private _modalService: NgbModal, private _toasterService: ToasterService, protected router: Router, private activatedRoute: ActivatedRoute, private _globals: Globals, private loaderService: LoaderService) {

    }

    ngOnInit() {

        this.activatedRoute.params.subscribe(params => {
            this.nodeId = params['id'];
            if (this.nodeId) {
                this.isNewUpdate = false;
            }

        });

        if (this.nodeId) {
            let postObj: any = {};
            this.loaderService.display(true);
            this._pagesService.getFaq({ 'faqID': this.nodeId }).subscribe(res => {
                this.faqModel = res[0]['fields'];
                this.faq = res[0];
                this.loaderService.display(false);
            });

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

            this.loaderService.display(true);
            let postdata: any = {};
            postdata.fields = this.faqModel;
            this._pagesService.saveFaq(postdata).subscribe(
                data => {
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/faq'])
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                },
            );
        } else {

            this.loaderService.display(true);
            let postdata: any = {};
            this.faq.fields = this.faqModel;

            this._pagesService.updateFaq(this.faq).subscribe(
                data => {
                    this.content = "Faq updated successfully."
                    this.showToast(this.type, this.title, this.content);
                    this.router.navigate(['/pages/faq'])
                },
                error => {
                    this.type = 'error';
                    this.title = "Error";
                    this.content = "Something went wrong";
                    this.showToast(this.type, this.title, this.content);
                },
            );
        }
    }
}