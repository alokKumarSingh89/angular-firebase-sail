import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class DataService {

  private bookingTypes = new BehaviorSubject<any>('Event');
  bookingType = this.bookingTypes.asObservable();

  constructor() { }

  changeType(goal) {
    this.bookingTypes.next(goal)
  }

}
