import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  date: any;
  outlet: string;
  orderNumber: string;
  totalAmount: number;

  menuData: any;
  orderData: any = [];

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.totalAmount = 0;
    this.http.get(environment.url + 'order').subscribe(
      (result: StockData) => {
        this.menuData = result;
      }, error => {
        console.log(error);
      }
    );
  }


  billEntryHandler() {
    this.updatingBill = true;
    const billStatement = {};
    billStatement['outlet'] = this.outlet;
    billStatement['total'] = this.totalAmount;
    billStatement['date'] =  this.date;
    billStatement['items'] = [];
    this.orderData.forEach(
      item => {
        billStatement['items'].push(
          {
            'item': this.menuData.Items.filter(data => data.Item === item.itemName)[0].ID,
            'qty': item.qty,
            'amount': item.amount,
            'date': this.date,
          }
        );
      }
    );
    this.http.post(environment.url + 'billentry', billStatement).subscribe(
      result => {
        this.updatingBill = false;
        this.alertGenerateHandler('Bill Generated Successfully', 'success');
      }, error => {
        this.updatingBill = false;
        console.log(error);
        this.alertGenerateHandler('something went wrong', 'error');
      }
    );
  }

  billItemInsertHandler() {
    this.orderData.push({
      'itemName': '',
      'qty': null,
      'rate': null,
      'amount': 0
    });
  }

  billItemRemoveHandler(index) {
    this.orderData.splice(index, 1);
    this.findGrandTotalHandler();
  }

  billCalculatorHandler(index) {
    if (this.orderData[index].qty && this.orderData[index].rate) {
      this.orderData[index].amount = this.orderData[index].qty * this.orderData[index].rate;
    }
    this.findGrandTotalHandler();
  }

  findGrandTotalHandler() {
    this.totalAmount = 0;
    this.orderData.forEach( item => {
      this.totalAmount += item.amount;
    });
  }

  alertGenerateHandler(message, status) {
    this.alertMsg = message;
    this.alertStatus = status;
    this.alertActive = true;
    setTimeout(() => {
      this.alertActive = false;
    }, 5000);
  }

  addItemToOrder(index) {
    console.log(index + ' item added');
  }

}

export interface StockData {
  menu: any;
  outlet: any;
  discount: any;
}

