import { Component, OnInit } from '@angular/core';
import { CallsService } from '../calls.service';
import { orderBy  } from 'lodash';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orderListData:any =[];
  orderNowData:any =[];

  searchText = '';
  sortOrder: boolean = true;

  constructor(private callsService: CallsService) { }

  ngOnInit(): void {

    if(this.callsService.orderNow){
      this.orderNowData = this.callsService.orderNow;
    }

    if(this.callsService.orderList?.length){
      this.orderListData = this.callsService.orderList;
      console.log(this.orderListData, "order list data");
      this.sortData();
    }

    else{
      console.log("else order list");
      this.callsService.getLocalFile('./assets/json/order-list.json').then((data) => {
      this.orderListData = data;
      this.callsService.orderList = this.orderListData;
      console.log(this.orderListData, "order list data");
      this.mergeData(this.orderListData,this.orderNowData);
    })
  }

    if(this.orderListData.length && this.callsService.orderNow ){
      this.mergeData(this.orderListData,this.orderNowData);
      console.log("final order list data",this.orderListData);
    }

    

  }

  async mergeData(orderList:any,orderNow:any){
    let data =[];
    data =[...orderNow,...orderList];
    this.callsService.orderNow = [];
    this.orderListData = data;
    this.callsService.orderList = this.orderListData;
    await this.oneMonthData(this.callsService.orderList);
  }

  sortData() { //sorting data based on date. Intially sorted by desc, after user clicks sorted by asc and vice versa.ss
    console.log("sort data");
    if (this.sortOrder) {
			this.orderListData = orderBy(this.orderListData , ['DATE'], ['desc']);
		}
		else {
			this.orderListData  = orderBy(this.orderListData , ['DATE'], ['asc']);
		}
  }
  
  oneMonthData(data:any){
    console.log("inside one month function !!!",data);

    let arr = data;

    let today : any = new Date();
    let result:any = arr.filter((obj:any) => {
      console.log("obj",obj);
      let price = (obj.PRICE * obj.quantity) || (obj.PRICE * obj.QUANTITY);
      obj.CARTPRICE = `${price}`;
      console.log("prize",price);

      // changing to MM/DD/YYYY format to pass into new Date()
      let dateArray = obj.DATE.split('-');
      let temp = dateArray[0];
      dateArray[0] = dateArray[1];
      dateArray[1] = temp;
      let datum = dateArray.join('-');
     
      let date :any= new Date(datum);
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays <= 30);
    });

    result.sort((a:any, b:any) => {
      a = new Date(a.datum);
      b = new Date(b.datum);
      return (a < b) ? -1 : (a > b) ? 1 : 0;
    })
    console.log(result,"result");
    console.log(this.orderListData,"order list");
    this.orderListData = result;
    this.sortData();
  }

}
