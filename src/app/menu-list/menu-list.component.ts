import { Component, OnInit } from '@angular/core';
import { CallsService } from '../calls.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  menuListData: any;
  cartListData = [{}];

  quantity: any;
  add2cart: any;
  uniqueCartValues: any;
  addToCard: string = 'Add to Cart';
  addedToCard: string = 'Added to Cart';
  notAvailable: string = 'Not Available';

  @Output() badgeEvent = new EventEmitter<number>();
  
  constructor(private callsService: CallsService) { }

  ngOnInit(): void {
    console.log("ng on init menu list page");
    if ((this.callsService.menuList)?.length) {
      console.log("if menu list in service");
      this.menuListData = this.callsService.menuList;
      this.quantity = new Array(this.menuListData.length);
      this.add2cart = new Array(this.menuListData.length);
      for (let val in this.menuListData) {
        this.quantity[val] = this.menuListData[val].quantity || '1';
        this.add2cart[val] = this.menuListData[val].add2cart || '0';
      }
      this.cartListData = this.callsService.cartList;
      console.log(this.cartListData, "cardlist data");
    }
    else {
      console.log("else if menu list in service");
      this.callsService.getLocalFile('./assets/json/menu-list.json').then((data) => {
        console.log(data, "menu list jsonData");
        this.menuListData = data;
        this.callsService.menuList = this.menuListData;
        this.quantity = new Array(this.menuListData?.length).fill(1);
        this.add2cart = new Array(this.menuListData?.length).fill(0);
      })
    }

    if ((this.callsService.cartList)?.length == 0) {
      console.log("empty cart list in service");
      this.quantity = new Array(this.menuListData?.length).fill(1);
      this.add2cart = new Array(this.menuListData?.length).fill(0);
    }


  }

  increaseValue(value: any, index: number) {
    console.log("increase value", value.quantity, index);
    this.quantity[index] = parseInt(value.quantity) + 1;
    this.addToCart(this.menuListData[index], this.quantity[index]);
  }
  decreaseValue(value: any, index: number) {
    console.log("decrease value", value.quantity, index);
    if ((value.quantity - 1) == 0) return;
    if (value.quantity != 0)
      this.quantity[index] = parseInt(value.quantity) - 1;
    this.addToCart(this.menuListData[index], this.quantity[index]);
  }

  addToCart(data: any, quantity: any) {
    console.log("Add to cart clicked", data, quantity);
    if (quantity.quantity) {
      this.cartListData.push({ ...data, ...quantity, add2cart: `${1}` });
    }
    else {
      this.cartListData.push({ ...data, quantity: `${quantity}`, add2cart: `${1}` });
    }
    let cartArray = this.cartListData.filter(value => Object.keys(value).length !== 0);
    cartArray = cartArray.filter((el: any) => el.cartPrize != 0);
    this.uniqueCartValues = Object.values(cartArray.reduce((acc: any, cur: any) => Object.assign(acc, { [cur.NAME]: cur }), {}));
    this.cartListData = this.uniqueCartValues;
    this.callsService.cartList = this.cartListData;
    this.addBadge(this.cartListData?.length);
    for (let i of this.menuListData) {
      for (let j of this.uniqueCartValues) {
        if (j.NAME === i.NAME) {
          i.quantity = j.quantity;
          i.add2cart = j.add2cart;
          i = j;
        }
      }
    }
    this.callsService.menuList = this.menuListData;
    console.log("Menu list in service ***", this.callsService.menuList);
  }

  addBadge(value: number) {
    this.badgeEvent.emit(value);
  }


}
