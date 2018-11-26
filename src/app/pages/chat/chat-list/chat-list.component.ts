import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject , AngularFireList} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../../../globals';
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { PagesService } from '../../pages.service';
import {ChatService} from "../../../@core/data/chat.service";

@Component({
  selector: 'chat-list',
  templateUrl: 'chat-list.component.html',
  styleUrls: ['chat-list.component.scss'],
})
export class ChatListComponent implements OnInit{


  constructor(private chatService: ChatService) {


  }

  ngOnInit(){
  }


}
