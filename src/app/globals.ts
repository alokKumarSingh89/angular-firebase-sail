import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

Injectable()
export class Globals {

  // API_URL = window['API_URL'] ||'https://cors-anywhere.herokuapp.com/https://appyapp.mobi';
  API_KEY = '$2a$10$.CPkZU3.R3bRE3bDI5epUuuHrUe63EbqW7HhhOriSj5beFwTdT16W';
  API_URL = window['API_URL'] ||'https://cors-anywhere.herokuapp.com/http://52.63.99.145:1338/nmt';
  // API_URL = window['API_URL'] ||'http://52.63.99.145:1338/nmt';
  // API_URL = window['API_URL'] ||' https://appyapp.mobi';
  // API_URL = window['API_URL'] ||'https://cors-anywhere.herokuapp.com/https://appyapp.mobi';
  APP_TYPE = 'nmt';
  // API_KEY = localStorage.getItem('sToken');

  USER_ROLE = ['admin',
    'employee',
    'gardener',
    'electrician',
    'security'];

  CONSULATION_TYPE = [
    {
      key: 'prescription',
      value: 'Prescription',
    },
    {
      key: 'user_note',
      value: 'User Note',
    },
    {
      key: 'consultant_note',
      value: 'Consultant Note',
    }
  ];

  MEMBER_ROLE = [
    {
      key: 'CARE_TAKER',
      value: 'Care Taker'
    },
    {
      key: 'CARE_PROVIDER',
      value: 'Care Provider'
    },
    {
      key: 'GENERAL',
      value: 'General'
    },
    {
      key: 'VOLUNTEER',
      value: 'Volunteer'
    },
  ];


  isLogged() {
    if (localStorage.getItem('sToken')) {
      return true;
    }
    else {
      return false;
    }
  }

  // Logout user. Clear all localstorage
  logoutUser() {
    localStorage.clear();
    return true;
  }

  canCreate(nodeType) {
    let menuList = JSON.parse(localStorage.getItem('viewAccess'));
    var selectedMenu;
    for (let key in menuList) {
      let mainMenu = menuList[key];

      if (mainMenu.dispName == nodeType) {
        selectedMenu = mainMenu;
      }
      let childrenMenu: Array<any> = [];

      if (mainMenu.items != undefined) {
        for (let skey in mainMenu.items) {

          if (mainMenu.items[skey].dispName == nodeType) {
            selectedMenu = mainMenu.items[skey];
          }
        }
      }
    }
    if (selectedMenu.allowCreate != undefined) {
      return selectedMenu.allowCreate;
    } else {
      return false;
    }
  }

  canEdit(nodeType) {
    let menuList = JSON.parse(localStorage.getItem('viewAccess'));
    var selectedMenu;
    for (let key in menuList) {
      let mainMenu = menuList[key];
      if (mainMenu.dispName == nodeType) {
        selectedMenu = mainMenu;
      }
      let childrenMenu: Array<any> = [];

      if (mainMenu.items != undefined) {
        for (let skey in mainMenu.items) {

          if (mainMenu.items[skey].dispName == nodeType) {
            selectedMenu = mainMenu.items[skey];
          }
        }
      }
    }
    if (selectedMenu.allowEdit != undefined) {
      return selectedMenu.allowEdit;
    } else {
      return false;

    }
  }

  canView(nodeType) {
    let menuList = JSON.parse(localStorage.getItem('viewAccess'));
    var selectedMenu;
    for (let key in menuList) {
      let mainMenu = menuList[key];
      if (mainMenu.dispName == nodeType) {
        selectedMenu = mainMenu;
      }
      let childrenMenu: Array<any> = [];

      if (mainMenu.items != undefined) {
        for (let skey in mainMenu.items) {

          if (mainMenu.items[skey].dispName == nodeType) {
            selectedMenu = mainMenu.items[skey];
          }
        }
      }
    }

    if (selectedMenu.allowList != undefined) {
      return selectedMenu.allowList;
    } else {
      return false;
    }
  }

  public getDate() {
    var d = new Date();
    return d;
  }

  public getDateMilliSecond() {
    var d = new Date();
    var n = d.getTime();
    return n;
  }

  public getDateFormat(date = null) {
    if (date == null) {
      date = new Date();
    }
    return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
  }

  public getMilliSecondToDateString(date) {
    if (date != undefined) {
      var d = new Date(date);
      return d.toLocaleString();
    }
    return "";

  }



  public getFirebaseChatEnv() {
    const environment = {
      production: false,
      firebase: {
        apiKey: 'AIzaSyBoXDIJTYZZNHPBdgKigJ9MiFU_rBPQC3s',
        authDomain: 'chat-41e02.firebaseapp.com',
        databaseURL: 'https://chat-41e02.firebaseio.com',
        projectId: 'chat-41e02',
        storageBucket: 'chat-41e02.appspot.com',
        messagingSenderId: '176908068181'
      }
    }
    return environment;
  }
}
