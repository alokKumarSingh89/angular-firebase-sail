import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase/app'

import { AngularFireAuth } from 'angularfire2/auth'
let counter = 0;

@Injectable()
export class UserService {
  user: Observable<firebase.User>;
  private users = {
    nick: { name: 'Nick Jones', picture: 'assets/images/nick.png' },
    eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
  };

  private chatUsers = [{ id: 1, name: 'admindash3@gmail.com', email: 'admindash3@gmail.com', picture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_08.jpg' },
  { id: 2, name: 'admindash2@gmail.com', email: 'admindash2@gmail.com', picture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_09.jpg' },
  { id: 3, name: 'mychurch1911@gmail.com', email: 'mychurch1911@gmail.com', picture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_07.jpg' },
  { id: 4, name: 'codemaaker2016@gmail.com', email: 'codemaaker2016@gmail.com', picture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_06.jpg' }];
  private userArray: any[];
  private quickUser: any[];
  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
    this.userArray = Object.values(this.chatUsers);
  }
  setChatUserList(chatUsers) {
    this.quickUser = chatUsers;
  }
  loginUsingFirebase(user) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
  }
  getUsers(): Observable<any> {
    return Observable.of(this.chatUsers);
  }
  getQuickUsers(): Observable<any> {
    return Observable.of(this.quickUser);
  }
  getUserArray(): Observable<any[]> {
    return Observable.of(this.userArray);
  }

  getUser(): Observable<any> {
    counter = (counter + 1) % this.userArray.length;
    return Observable.of(this.userArray[counter]);
  }
}
