import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { ChatMessage } from '../../models/chat-message.model';
import { Conversation } from '../../models/conversation.model';
import { UserService } from './users.service';
import { ChatConfig } from '../../models/chat-config.model';
import * as _ from 'lodash';
import {Globals} from '..//../globals'
@Injectable()
export class ChatService {

  chatMessages: AngularFireList<ChatMessage>;
  chatConversations: AngularFireList<Conversation>;
  userName: Observable<string>;
  email: string = localStorage.getItem('email');
  enterprise_name: string = '';
  data: Conversation[];

  constructor(private db: AngularFireDatabase, private userService: UserService,private global:Globals) {
    this.userService.getUser().subscribe(a => {
      this.userName = a.name;
      this.enterprise_name = global.APP_TYPE;
    });
  }

  getUser() {
    return this.userService.getUser();
  }

  getUsers() {
    return this.userService.getUsers();
  }

  sendMessage(text: string, photoUrl: string, imageUrl: string, conversation: Conversation) {
    this.chatMessages = this.getMessages(conversation.appyID);
    const time = new Date().getTime();
    this.chatMessages.push({
      name: this.email,
      time: time,
      photoUrl: photoUrl,
      imageUrl: imageUrl,
      text: text,
    });
    if (imageUrl !== '') {
      this.updateLastMessage(conversation.$key, text, this.email);
    }
  }

  sendConversation(createdBy: string, createdTime: number, iconURL: string,
    imageUrl: string[], lastMessage: string, name: string, participantsCS: string[], isGroupChat: boolean,desc: string) {

    const applyID = this.getAppyID(createdBy, createdTime);
    const participantList = this.getParticipantsList(participantsCS);
    for (const user of participantsCS) {
      this.chatConversations = this.getConversations(this.enterprise_name, user);
      this.chatConversations.push({
        appyID: applyID,
        createdBy: this.email,
        createdTime: createdTime,
        iconURL: iconURL,
        imageUrl: imageUrl,
        lastMessage: lastMessage,
        name: name,
        participantsCS: participantList,
        isGroupChat: isGroupChat,
        desc:desc
      });
    }
  }


  addUpdateConversation(selectedConversation: Conversation, createdTime: number,
    name: string, newParticipantList: any[], allParticipantsList: any[]) {
    const applyID = selectedConversation.appyID;
    const participantList = this.getParticipantsList(allParticipantsList);
    for (const user of newParticipantList) {
      this.chatConversations = this.getConversations(this.enterprise_name, user);
      this.chatConversations.push({
        appyID: applyID,
        createdBy: this.email,
        createdTime: createdTime,
        iconURL: selectedConversation.iconURL,
        imageUrl: selectedConversation.imageUrl,
        lastMessage: '',
        name: name,
        participantsCS: participantList,
        isGroupChat: true,
      });
    }
  }
  getListOnDynamicOnConversation(key,value,user){
    return this.db.list(this.enterprise_name + '/' + user.replace(/\./g, '_') + '/conversations',
        ref => ref.orderByChild(key).equalTo(value)
      )
  }
  deleteConversation(key:string,value:string,user:string){
    this.getListOnDynamicOnConversation(key,value,user).snapshotChanges().subscribe(data=>{
      this.db.list(this.enterprise_name + '/' + user.replace(/\./g, '_') + '/conversations/'+data[0].key)
      .remove();
    })
  }
  deleteChat(appyID:string){
    this.db.list(this.enterprise_name +"/chats/"+appyID).remove();
  }
  updateConversationList(selectedConversation: Conversation,email:string,key:string){
    this.getConversations(this.enterprise_name,email)
    .update(key,selectedConversation)

  }
  getMessages(appyID: string): AngularFireList<ChatMessage> {
    return this.db.list(this.enterprise_name + '/chats/' + appyID);
  }

  getConversations(enterpriseName: string, email: string): AngularFireList<Conversation> {
    return this.db.list(this.enterprise_name + '/' + email.replace(/\./g, '_') + '/conversations');
  }

  getConversationsConfigs(enterpriseName: string, email: string): AngularFireList<ChatConfig> {
    return this.db.list(this.enterprise_name + '/conversation_config/' + email.replace(/\./g, '_'));
  }

  getAppyID(createdBy: string, createdTime: number): string {
    return 'CONV_' + createdBy.replace(/\./g, '_') + '_' + createdTime;
  }

  getParticipantsList(participantsCS: string[]) {

    participantsCS = participantsCS.sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    let emailList = '';
    const length = participantsCS.length;
    for (let i = 0; i < length; i++) {
      emailList += participantsCS[i] + (i !== (length - 1) ? ',' : '');
    }
    return emailList;
  }

  updateLastMessage(key: string, email: string, lastMessage: string) {
    this.db.list(this.enterprise_name + '/' + email.replace(/\./g, '_') + '/conversations')
      .update(key, { lastMessage: lastMessage }).catch(error => this.handleError(error));
  }

  getSelectedUserConversation(participants: string): AngularFireList<Conversation> {
    return this.db.list(this.enterprise_name + '/' + this.email.replace(/\./g, '_') + '/conversations',
      ref => ref.orderByChild('participantsCS').equalTo(participants)
    )
  }
  getSelectedUserQickConversation(createdBy: string): AngularFireList<Conversation> {
    return this.db.list(this.enterprise_name + '/' + this.email.replace(/\./g, '_') + '/quickchats',
      ref => ref.orderByChild('createdBy').equalTo(createdBy)
    )
  }
  getQuickChatUser():AngularFireList<Conversation>{
    return this.db.list(this.enterprise_name + '/' + this.email.replace(/\./g, '_') + '/quickchats')
  }
  deleteQuickChatUser(key:string){
    this.db.list(this.enterprise_name + '/' + this.email.replace(/\./g, '_') + '/quickchats/'+key).remove()
  }
  private handleError(error) {
    console.log(error);
  }


}
