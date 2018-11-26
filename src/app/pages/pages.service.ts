import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Globals } from '../globals';




@Injectable()
export class PagesService {

  headers: {};
  constructor(private http: HttpClient, private _globals: Globals) {
    this.headers = new HttpHeaders()
      .set('token', localStorage.getItem('access_token'))
      .set('apikey', this._globals.API_KEY)
      .set('apptype', this._globals.APP_TYPE);

  }

  getImages() {
    return this.http.get(this._globals.API_URL + '/images', { headers: this.headers });
  }


  uploadImage(body) {
    return this.http.post(this._globals.API_URL + '/uploadFile', body, { headers: this.headers });
  }

  saveNode(body) {
    return this.http.post(this._globals.API_URL + '/node', body, { headers: this.headers });
  }

  updateNode(body) {
    return this.http.put(this._globals.API_URL + '/node?nodeId=' + body.id, body, { headers: this.headers });
  }

  updateProfile(body) {
    return this.http.put(this._globals.API_URL + '/profile', body, { headers: this.headers });
  }

  getMembers() {
    return this.http.get(this._globals.API_URL + '/subscribers?enterprizeEmail=' + localStorage.getItem('email'), { headers: this.headers });
  }


  getNodes(nodeType) {
    return this.http.get(this._globals.API_URL + '/node?nodeType=' + nodeType, { headers: this.headers });

    // return this.http.get(this._globals.API_URL + '/node?nodeType=' + nodeType, { headers: this.headers });
  }

  getNode(postObj) {
    return this.http.post(this._globals.API_URL + '/searchNode', postObj, { headers: this.headers });
  }

  deleteNode(nodeId) {
    return this.http.delete(this._globals.API_URL + '/node?nodeId=' + nodeId, { headers: this.headers });
  }

  getMenu() {

    let menuList = JSON.parse(localStorage.getItem('viewAccess'));

    let menuArray: Array<any> = [];
    let menuIcon: Array<any> = [];

    menuIcon['Dashboard'] = "nb-home";
    menuIcon['Broadcast'] = "nb-keypad";
    menuIcon['Facilities'] = "nb-compose";
    menuIcon['Members'] = "nb-gear";
    menuIcon['Chat'] = "nb-star";
    menuIcon['Payments'] = "nb-tables";
    menuIcon['Gallery'] = "nb-grid-a-outline";
    menuIcon['Attendance'] = "nb-bar-chart";
    menuIcon['Bookings'] = "nb-notifications";
    menuIcon['Visitor'] = "nb-audio";
    menuIcon['QuickChat'] = "nb-star";
    menuIcon['Payment Config'] = "nb-flame-circled";
    menuIcon['FAQs'] = "nb-lightbulb";
    menuIcon['FAQ'] = "nb-lightbulb";
    menuIcon['Appointments'] = "nb-notifications";
    menuIcon['Communities'] = "nb-star";
    

    for (let key in menuList) {

      let mainMenu = menuList[key];
      let menu: any = {};
      menu.title = mainMenu.dispName;
      menu.link = "/pages" + mainMenu.url;
      menu.icon = menuIcon[mainMenu.dispName];
      let childrenMenu: Array<any> = [];

      if (mainMenu.items != undefined) {
        for (let skey in mainMenu.items) {
          let subMenu = mainMenu.items[skey];
          let submenuObj: any = {};
          submenuObj.title = subMenu.dispName;
          submenuObj.link = "/pages" + subMenu.url;
          childrenMenu.push(submenuObj);
        }
        menu.children = childrenMenu;
      }
      menuArray.push(menu);
    }

    // Add Logout link at the last menu
    let menu: any = {};
    menu.title = 'Logout';
    menu.link = "/auth/logout";
    menu.icon = 'nb-power-circled';
    menuArray.push(menu);
    const MENU_ITEMS: NbMenuItem[] = menuArray
    return MENU_ITEMS;
  }


  saveAttendance(body) {
    return this.http.post(this._globals.API_URL + '/attendance/create', body, { headers: this.headers });
  }

  getAttendance(body) {
    return this.http.post(this._globals.API_URL + '/attendance/find', body, { headers: this.headers });
  }


  updatAttendance(body) {
    return this.http.post(this._globals.API_URL + '/attendance/update/' + body.id, body, { headers: this.headers });
  }

  deleteAttendance(body) {
    return this.http.delete(this._globals.API_URL + '/attendance/delete/' + body, { headers: this.headers });
  }


  getPaymentList() {
    return this.http.get(this._globals.API_URL + '/payments/get', { headers: this.headers });
  }


  getPayments(body) {
    return this.http.post(this._globals.API_URL + '/payments/find', body, { headers: this.headers });
  }

  updateMember(body) {
    return this.http.put(this._globals.API_URL + '/administerProfile', body, { headers: this.headers });
  }


  deleteMember(nodeId) {
    return this.http.delete(this._globals.API_URL + '/user/delete/' + nodeId, { headers: this.headers });
  }

  getEnterpriseprofile(body) {
    return this.http.get(this._globals.API_URL + '/enterpriseprofile', { headers: this.headers });
  }

  updateEnterpriseprofile(body) {
    return this.http.put(this._globals.API_URL + '/enterpriseprofile', body, { headers: this.headers });
  }

  getVisitorList(body) {
    return this.http.post(this._globals.API_URL + '/visitor/search', body, { headers: this.headers });
  }

  getVisitor(id) {
    return this.http.post(this._globals.API_URL + '/visitor/search', { id: id }, { headers: this.headers });
  }

  updateVisitor(visitor) {
    const id = visitor[0]['id'];
    return this.http.put(this._globals.API_URL + '/visitor/update?id=' + id, visitor[0], { headers: this.headers });
  }

  deleteVisitor(nodeId) {
    return this.http.delete<any[]>(this._globals.API_URL + '/visitor/delete?visitorID=' + nodeId, { headers: this.headers });
  }


  addVisitor(visitor) {
    return this.http.post(this._globals.API_URL + '/visitor/create', visitor, { headers: this.headers });
  }

  searchUser(visitor) {
    return this.http.post<any[]>(this._globals.API_URL + '/user/search', visitor, { headers: this.headers });
  }

  updateVisitorStatus(visitorId, status) {
    // const id = visitor[0]['id'];
    return this.http.post(this._globals.API_URL + '/visitor/status?visitorID=' + visitorId, status, { headers: this.headers });
  }

  saveConsultation(consultation) {
    return this.http.post<any[]>(this._globals.API_URL + '/consultation/create', consultation, { headers: this.headers });
  }

  getConsultations(consultation) {
    return this.http.post<any[]>(this._globals.API_URL + '/consultation/search', consultation, { headers: this.headers });
  }

  updateConsultation(consultation) {
    return this.http.put<any[]>(this._globals.API_URL + `/consultation/update?id=${consultation.id}`, consultation, { headers: this.headers });
  }

  
  deleteConsultation(id) {
    return this.http.delete<any[]>(this._globals.API_URL + `/consultation/delete?consultationID=${id}`, { headers: this.headers });
  }

  saveFaq(faq) {
    return this.http.post<any[]>(this._globals.API_URL + '/faq/create', faq, { headers: this.headers });
  }

  getFaq(faq) {
    return this.http.post<any[]>(this._globals.API_URL + '/faq/search', faq, { headers: this.headers });
  }

  updateFaq(faq) {
    return this.http.put<any[]>(this._globals.API_URL + `/faq/update?id=${faq.id}`, faq, { headers: this.headers });
  }

  

  deleteFaq(id) {
    return this.http.delete<any[]>(this._globals.API_URL + `/faq/delete?faqID=${id}`, { headers: this.headers });
  }

  getPaymentConfiguration(postData){
    return this.http.post<any[]>(this._globals.API_URL + `/paymentconfig/search`, postData , { headers: this.headers });
  }

  updatePaymentConfiguration(postData, id){
    return this.http.put<any[]>(this._globals.API_URL + `/paymentconfig/update?id=${id}`, postData , { headers: this.headers });
  }

  createPaymentConfiguration(postData){
    return this.http.post<any[]>(this._globals.API_URL + `/paymentconfig/create`, postData , { headers: this.headers });
  }

  
  saveBooking(body) {
    return this.http.post(this._globals.API_URL + '/booking/create', body, { headers: this.headers });
  }

  updateBooking(body) {
    return this.http.put(this._globals.API_URL + '/update?bookingID=' + body.fields.bookingID, body, { headers: this.headers });
  }

  getBooking(searchNode) {
    return this.http.post(this._globals.API_URL + '/booking/search' , searchNode , { headers: this.headers });
  }

  deleteBooking(bookingId) {
    return this.http.delete(this._globals.API_URL + `/booking/delete?bookingId=${bookingId}` , { headers: this.headers });
  }


}


