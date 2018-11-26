import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../@core/data/chat.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { ModalComponent } from '../../events/modal/modal.component';
import { PagesService } from '../../pages.service';
import { LoaderService } from '../../../loader.service';
@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss']
})
export class ChatGroupComponent implements OnInit {
  users: any;
  selectedMembers = [];
  email: string = localStorage.getItem('email');
  groupname: string = '';
  groupdesc: string = '';
  members = [];
  imagesArray;
  imageUrl: string[] = [];
  iconUrl: string = '';
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  public activeModal: NgbModalRef;

  constructor(private chat: ChatService, protected router: Router, private _modalService: NgbModal,
    private _pagesService: PagesService, private loadService: LoaderService) {
    chat.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  previewUrlModal(type) {
    this.activeModal = this._modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    this.activeModal.componentInstance.modalHeader = 'Large Modal';
    this.activeModal.componentInstance.previewURLs = this.imagesArray;
    this.activeModal.result.then((results) => {
      if (results != undefined) {
        if (type == 'icon') {
          this.iconUrl = results.url;
        } else {
          this.imageUrl.push(results.url)
        }
      }
    }, (reason) => {
      console.log('reason', reason)
    });
  }
  addConversation() {
    const createdTime = new Date().getTime();
    const appyID = this.chat.getAppyID(this.email, createdTime);
    this.chat.sendConversation(this.email, createdTime, this.iconUrl,
      this.imageUrl, '', this.groupname, this.selectedMembers, true,this.groupdesc);
    this.router.navigate(['/pages/chat'])
  }
  onSearch(event:any){
    let searchQuery = {}
    if(event.target.value.length%2==0){
      searchQuery['limit'] = 10
      searchQuery["email"] = {"startsWith":event.target.value}
      this.searchUser(searchQuery)
    }
  }
  ngOnInit() {
    this.searchUser({'limit':100});
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Members",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'myclass custom-class-example',
      enableSearchFilter: true,
      maxHeight: 150,
    };
    this._pagesService.getImages().subscribe(
      data => {
        this.imagesArray = data;
      },
      error => {

      }
    );
  }
  searchUser(postObj) {
    // postObj['limit'] = 10;
    postObj['offset'] = 0;
    // this.loadService.display(true);
    this._pagesService.searchUser(postObj).subscribe(data => {
      this.members = [];
      let tempData: any = {};
      for (var key in data) {
        tempData = data[key];
        if(!tempData.email)continue;
        if (tempData.profileImageURL == undefined) {
          tempData.profileImageURL = 'assets/images/user_icon.png';
        }
        if (tempData.email === undefined) {
          tempData.email = '';
        }
        tempData.roleIcon = 'assets/images/user_icon.png';
        if (tempData.badge_id == undefined) {
          tempData.badge_id = "";
        }
        this.loadService.display(false);
        this.members.push(tempData);
      }
      this.loadService.display(false);
      this.dropdownList = this.members.map((user, i, array) => {
        return { id: user.id, itemName: user.email }
      });
      this.selectedItems = this.dropdownList.filter(user=>{
        return user.itemName != this.email;
      });
      this.getSelectedMembers(this.selectedItems)
    }, error => {
      this.loadService.display(false);
    });
  }
  getSelectedMembers(selectedItems) {
    this.selectedMembers = [];
    this.selectedMembers.push(this.email);
    selectedItems.map((item) => {
      this.members.map((user) => {
        if (item.id === user.id) {
          this.selectedMembers.push(user.email);
        }
      });
    });
  }

  onItemSelect(item: any) {
    this.getSelectedMembers(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    this.getSelectedMembers(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log("item",items)
    this.getSelectedMembers(items);
  }
  onDeSelectAll(items: any) {
    this.getSelectedMembers(items);
  }

}
