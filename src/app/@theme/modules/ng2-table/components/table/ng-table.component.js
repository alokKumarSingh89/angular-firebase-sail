"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var NgTableComponent = (function () {
    function NgTableComponent(sanitizer) {
        this.sanitizer = sanitizer;
        // Table values
        this.rows = [];
        // Outputs (Events)
        this.tableChanged = new core_1.EventEmitter();
        this.cellClicked = new core_1.EventEmitter();
        this.cellEdited = new core_1.EventEmitter();
        this.cellDeleted = new core_1.EventEmitter();
        this.cellSendNotificationed = new core_1.EventEmitter();
        this.cellViewGalleryed = new core_1.EventEmitter();
        this.cellAdded = new core_1.EventEmitter();
        this.cellLinked= new core_1.EventEmitter();
        this.cellConsultationed = new core_1.EventEmitter();
        this.showFilterRow = false;
        this._columns = [];
        this._config = {};
    }
    Object.defineProperty(NgTableComponent.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (conf) {
            if (!conf.className) {
                conf.className = 'table-striped table-bordered';
            }
            if (conf.className instanceof Array) {
                conf.className = conf.className.join(' ');
            }
            this._config = conf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTableComponent.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (values) {
            var _this = this;
            values.forEach(function (value) {
                if (value.filtering) {
                    _this.showFilterRow = true;
                }
                if (value.className && value.className instanceof Array) {
                    value.className = value.className.join(' ');
                }
                var column = _this._columns.find(function (col) { return col.name === value.name; });
                if (column) {
                    Object.assign(column, value);
                }
                if (!column) {
                    _this._columns.push(value);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.sanitize = function (html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    };
    Object.defineProperty(NgTableComponent.prototype, "configColumns", {
        get: function () {
            var sortColumns = [];
            this.columns.forEach(function (column) {
                if (column.sort) {
                    sortColumns.push(column);
                }
            });
            return { columns: sortColumns };
        },
        enumerable: true,
        configurable: true
    });
    NgTableComponent.prototype.onChangeTable = function (column) {
        this._columns.forEach(function (col) {
            if (col.name !== column.name && col.sort !== false) {
                col.sort = '';
            }
        });
        this.tableChanged.emit({ sorting: this.configColumns });
    };
    NgTableComponent.prototype.getData = function (row, propertyName) {
        var data84 =  propertyName.split('.').reduce(function (prev, curr) { 
            if(prev[curr] != undefined){
                    if(prev[curr].indexOf("https://") !== -1 && (prev[curr].match(/\.(jpeg|jpg|gif|png)$/) != null)){
                        return "<img src='"+prev[curr]+"' width='50px'/>";
                    }else if(curr === 'profileImageURL'){
                        return "<img src='"+prev[curr]+"' width='50px' height='50px' />";
                    }else if(curr === 'roleIcon'){
                        return "<img src='"+prev[curr]+"' width='50px' height='50px' />";
                    }else{
                        return prev[curr];
                    }
            }else{
                return "";
            }
             }, row);
        return data84;
    };
    NgTableComponent.prototype.cellClick = function (row, column) {
        this.cellClicked.emit({ row: row, column: column });
    };

    NgTableComponent.prototype.cellEdit = function (row) {
        this.cellEdited.emit({ row: row});
    };

    NgTableComponent.prototype.cellDelete = function (row) {
        this.cellDeleted.emit({ row: row});
    };

    NgTableComponent.prototype.cellNotification = function (row) {
        this.cellSendNotificationed.emit({ row: row});
    };

    NgTableComponent.prototype.cellViewGallery = function (row) {
        this.cellViewGalleryed.emit({ row: row});
    };

    NgTableComponent.prototype.cellAdd = function (row) {
        this.cellAdded.emit({ row: row});
    };

    NgTableComponent.prototype.cellLink = function (row) {
        this.cellLinked.emit({ row: row});
    };


    NgTableComponent.prototype.cellConsultation = function (row) {
        this.cellConsultationed.emit({ row: row});
    };


    
    

    

    NgTableComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ng-table',
                    template: "\n <table class=\"table dataTable\" ngClass=\"{{config.className || ''}}\"\n           role=\"grid\" style=\"width: 100%;\">\n      <thead>\n        <tr role=\"row\">\n          <th *ngFor=\"let column of columns\" [ngTableSorting]=\"config\" [column]=\"column\" \n              (sortChanged)=\"onChangeTable($event)\" ngClass=\"{{column.className || ''}}\">\n            {{column.title}}\n            <i *ngIf=\"config && column.sort\" class=\"pull-right fa\"\n              [ngClass]=\"{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}\"></i>\n  </th>\n     <th *ngIf='config.canEdit || config.canAttendace' > Action</th>    </tr>\n      </thead>\n      <tbody>\n      <tr *ngIf=\"showFilterRow\">\n        <td *ngFor=\"let column of columns\">\n          <input *ngIf=\"column.filtering\" placeholder=\"{{column.filtering.placeholder}}\"\n                 [ngTableFiltering]=\"column.filtering\"\n                 class=\"form-control\"\n                 style=\"width: auto;\"\n                 (tableChanged)=\"onChangeTable(config)\"/>\n        </td>\n  <td *ngIf='config.canEdit || config.canAttendace' > </td>    </tr>\n        <tr *ngFor=\"let row of rows\">\n          <td (click)=\"cellClick(row, column.name)\" *ngFor=\"let column of columns\" [innerHtml]=\"sanitize(getData(row, column.name))\"></td>\n  <td *ngIf='(config.canEdit || row.isAttendeenew || row.isAttendeeedit)' ><i  *ngIf='config.canGallery'  class='fa fa-image notification-btn' (click)=\"cellViewGallery(row,'d')\"></i><i *ngIf='config.canSendNotification' class='fa fa-bell notification-btn' (click)=\"cellNotification(row,'h')\"></i> <i *ngIf='row.isAttendeenew' class='fa fa-plus add-btn' (click)=\"cellAdd(row,'h')\"> </i><i *ngIf='(config.canEdit || row.isAttendeeedit)' class='fa fa-pencil edit-btn' (click)=\"cellEdit(row,'h')\"></i> <i  *ngIf='(config.canEdit || row.isAttendeeedit)'  class='fa fa-trash delete-btn' (click)=\"cellDelete(row,'d')\"></i> <i    *ngIf='config.isDisplayLinked' class='fa fa-users' (click)=\"cellLink(row,'d')\"></i><i    *ngIf='config.isDisplayConsultationed' class='fa fa-user-plus' (click)=\"cellConsultation(row,'d')\"></i></td>   </tr>\n      </tbody>\n    </table>\n  "
                },] },
    ]; 
    /** @nocollapse */
    NgTableComponent.ctorParameters = [
        { type: platform_browser_1.DomSanitizer, },
    ];
    NgTableComponent.propDecorators = {
        'rows': [{ type: core_1.Input },],
        'config': [{ type: core_1.Input },],
        'tableChanged': [{ type: core_1.Output },],
        'cellClicked': [{ type: core_1.Output },],
        'cellEdited': [{ type: core_1.Output },],
        'cellDeleted': [{ type: core_1.Output },],
        'cellSendNotificationed': [{ type: core_1.Output },],
        'cellViewGalleryed': [{ type: core_1.Output },],
        'columns': [{ type: core_1.Input },],
        'cellAdded': [{ type: core_1.Output },],
        'cellLinked': [{ type: core_1.Output },],
        'cellConsultationed': [{ type: core_1.Output },],
    };
    
    return NgTableComponent;
}());
exports.NgTableComponent = NgTableComponent;
