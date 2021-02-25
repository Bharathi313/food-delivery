import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  menuList: any = [];
  cartList: any = [];
  orderList: any;
  orderNow: any;
  constructor( private http: HttpClient) { }

  getLocalFile(path: string) {
    return this.http.get(path).toPromise();
  }

}
