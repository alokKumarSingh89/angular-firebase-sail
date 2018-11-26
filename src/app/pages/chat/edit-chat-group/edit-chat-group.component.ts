import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../../@core/data/chat.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Conversation } from "../../../models/conversation.model";
import { ModalComponent } from '../../events/modal/modal.component';
import { PagesService } from '../../pages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-edit-chat-group',
  templateUrl: './edit-chat-group.component.html',
  styleUrls: ['./edit-chat-group.component.scss']
})
export class EditChatGroupComponent implements OnInit {

  users: any;
  selectedMembers = [];
  enterprise_name: string = 'abc_software';
  email: string = localStorage.getItem('email');
  groupname: string = '';
  groupdesc: string = '';
  members = [];
  groupConversation: Conversation[];
  selectedConversation: Conversation;
  oldParticipantList: any[] = [];
  newParticipantList: any[] = [];
  private activeModal: NgbModalRef;
  userListKey: any[] = []
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  imagesArray;
  iconUrl: string;
  imageUrl: string[];
  constructor(private chat: ChatService, protected router: Router,
    private activateRoute: ActivatedRoute, private _modalService: NgbModal,
    private _pagesService: PagesService, private loadService: LoaderService) {

  }
  searchUser(postObj, callback) {
    postObj['limit'] = 100;
    postObj['offset'] = 0;
    this._pagesService.searchUser(postObj).subscribe(data => {
      this.members = [];
      let tempData: any = {};
      for (var key in data) {
        tempData = data[key];
        if (!tempData.email) continue;
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
      callback();
    }, error => {
      this.loadService.display(false);
    });
  }
  onSearch(event: any) {
    let searchQuery = {}
    if (event.target.value.length % 2 == 0) {
      searchQuery['limit'] = 10
      searchQuery["email"] = { "startsWith": event.target.value }
      this.searchUser(searchQuery, () => { })
    }
  }
  fetchUserDetails() {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.chat.getConversations(this.enterprise_name, this.email).valueChanges().subscribe(
      data => {
        this.selectedItems = [];
        this.groupConversation = data
        this.selectedConversation = this.groupConversation.filter(conversation => conversation.appyID === id)[0];
        this.groupname = this.selectedConversation.name;
        this.groupdesc = this.selectedConversation.desc;
        this.iconUrl = this.selectedConversation.iconURL
        this.imageUrl = this.selectedConversation.imageUrl ? this.selectedConversation.imageUrl : []
        this.oldParticipantList = this.selectedConversation.participantsCS.split(',')
        this.members.map((user, i, array) => {
          if (this.oldParticipantList.includes(user.email) && user.email !== this.email) {
            this.selectedItems.push({ id: user.id, itemName: user.email })
          }
        });
        this.userListKey = []
        let userList = []
        this.oldParticipantList.forEach(user => {
          this.chat.getListOnDynamicOnConversation("appyID", this.selectedConversation.appyID, user).snapshotChanges().subscribe(conv => {
            if (userList.indexOf(user) == -1) {
              this.userListKey.push({ 'key': conv[0].key, 'email': user })
              userList.push(user);
            }
          })
        })
      }
    );

    

  }
  ngOnInit() {
    this.searchUser({}, ()=>{this.fetchUserDetails()});
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
      error => { }
    );
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

  addConversation() {
    const createdTime = new Date().getTime();
    this.selectedConversation.iconURL = this.iconUrl;
    this.selectedConversation.imageUrl = this.imageUrl;
    this.newParticipantList = this.selectedMembers.filter(item => this.oldParticipantList.indexOf(item) < 0);
    let removeUser = this.oldParticipantList.filter(item=> this.selectedMembers.indexOf(item) < 0)
    
    if (this.newParticipantList.length > 0) {
      this.chat.addUpdateConversation(this.selectedConversation, createdTime, this.groupname,
        this.newParticipantList, this.selectedMembers);
    } else {
      if(removeUser.length>0){
        this.selectedConversation.participantsCS = this.selectedMembers.join(",");
        // this.userListKey.forEach(user=>{
        //   if(removeUser.indexOf(user.email) > -1){
        //     this.chat.deleteConverstion
        //   }
        // })
      }
      this.userListKey.forEach(user => {
        this.chat.updateConversationList(this.selectedConversation, user.email, user.key);
      })
    }
    this.router.navigate(['/pages/chat'])
  }

  onItemSelect(item: any) {
    this.getSelectedMembers(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    this.getSelectedMembers(this.selectedItems);
  }
  onSelectAll(items: any) {
    this.getSelectedMembers(items);
  }
  onDeSelectAll(items: any) {
    this.getSelectedMembers(items);
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
}
