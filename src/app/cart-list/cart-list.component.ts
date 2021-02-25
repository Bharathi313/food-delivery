import { Component, OnInit } from '@angular/core';
import { CallsService } from '../calls.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  cartItems: any;
  quantity: any;
  menuItems: any;
  mergeOrderItems = [];
  orderLists: boolean = false;
  add2cart: any;
  totalAmount : any;

  @Output() badgeEvent = new EventEmitter<number>();

  constructor(private callService: CallsService) { }

  ngOnInit(): void {

    if (this.callService.cartList) {
      this.cartItems = this.callService.cartList;
      this.quantity = new Array(this.cartItems.length);
      this.add2cart = new Array(this.cartItems.length);
      for (let val in this.cartItems) {
        this.quantity[val] = this.cartItems[val].quantity;
        this.add2cart[val] = this.cartItems[val].add2cart;
      }
      this.totalPrice();
    }
    else {
      this.cartItems = [];
    }

    console.log("cart list data",this.cartItems);

  }
  increaseValue(value: any, index: number) {
    console.log("increase value", value.quantity, index);
    this.quantity[index] = parseInt(value.quantity) + 1;
    this.modifyCart(this.cartItems[index], this.quantity[index]);
  }
  decreaseValue(value: any, index: number) {
    console.log("decrease value", value.quantity, index);
    if ((value.quantity - 1) == 0) {
      this.removeFromCart(this.cartItems[index]);
      return
    }

    if (value.quantity != 0) {
      this.quantity[index] = parseInt(value.quantity) - 1;
      this.modifyCart(this.cartItems[index], this.quantity[index]);
    }
  }
  removeFromCart(data: any) {
    console.log("remove an item", data);
    this.cartItems = this.cartItems.filter((el: any) => el.NAME != data.NAME);
    this.callService.cartList = this.cartItems;
    this.addBadge(this.cartItems?.length); 
    console.log(this.callService.cartList, "cart list after removing");

    this.quantity = new Array(this.cartItems.length);
    this.add2cart = new Array(this.cartItems.length);
    for (let val in this.cartItems) {
      this.quantity[val] = this.cartItems[val].quantity;
      this.add2cart[val] = this.cartItems[val].add2cart;
    }

    this.menuItems = this.callService.menuList;
    for (let i of this.menuItems) {
      if (data.NAME === i.NAME) {
        i.quantity = 1;
        i.add2cart = 0;
      }
    }
    this.callService.menuList = this.menuItems;
    console.log("menu list", this.menuItems);
  }

  modifyCart(data: any, quantity: any) {
    console.log("modify cart", data, quantity);
    data.quantity = `${quantity}`;
    this.menuItems = this.callService.menuList;
    for (let i of this.menuItems) {
      for (let j of this.cartItems) {
        if (j.NAME === i.NAME) {
          i.quantity = j.quantity;
          i = j;
        }
      }
    }
    this.totalPrice();
    console.log("modify menu list", this.menuItems);
  }
  totalPrice(){
    this.totalAmount = 0;
    for (let val in this.cartItems) {
      this.totalAmount = this.totalAmount + (this.cartItems[val].quantity * this.cartItems[val].PRICE);
    }
  }
  orderNow(data: any) {
    console.log("ordernow clicked", data);
    this.orderLists = true;
    let currentDate: any = new Date().toLocaleDateString();
    currentDate = currentDate.replaceAll('/', '-');
    let options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    let currentTime = new Date().toLocaleString('en-US', options);
    console.log("current date time", currentDate, currentTime);
    let newObj: any = [];
    data.forEach((element: any) => {
      newObj.push({ ...element, DATE: `${currentDate}`, TIME: `${currentTime}` });
    });
    console.log("Added date & date to object", newObj);
    this.callService.orderNow = newObj;
    console.log("order now service data", this.callService.orderNow);
    this.cartItems = [];
    this.callService.cartList = this.cartItems;
    this.addBadge(this.cartItems?.length); 
    console.log("final cart list data in service",this.callService.cartList);
  }

  addBadge(value: number) {
    this.badgeEvent.emit(value);
  }

}
