import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // private sendData: BehaviorSubject<{ value1: any, value2: any , value3 : any}> = new BehaviorSubject<{ value1: any, value2: any, value3 : any }>(null);

  // setData(value1: any, value2: any, value3 : any): void {
  //   const data = { value1, value2 , value3};
  //   this.sendData.next(data);
  // }

  // getData(): Observable<{ value1: any, value2: any, value3: any }> {
  //   return this.sendData.asObservable();
  // }
  constructor() { }
}
