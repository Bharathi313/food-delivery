import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'food-delivery-app';
  cartList:boolean=false;
  orderList:boolean=false;
  menuList:boolean=true;
  badgeLength: number = 0;

badgeValue(value:number){
  console.log("badge value",value);
  this.badgeLength = value;
}
  
}
