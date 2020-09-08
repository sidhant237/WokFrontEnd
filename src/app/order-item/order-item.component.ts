import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  categories: any;
  categorisedData: any;
  orderData: any = [];
  discount = {discuntId: null, discountname: null, active: false, discountvalue: 0};

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';

  myControl = new FormControl();

  filteredOptions: Observable<any[]>;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.totalAmount = 0;
    this.http.get(environment.url + 'order').subscribe(
      (result: StockData) => {
        this.menuData = result;
        this.categories = [...new Set(this.menuData.menu.map(item => item.catname))];
        this.categorisedData = this.groupDataByCategory();
        console.log(this.categorisedData);
      }, error => {
        console.log(error);
      }
    );

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.menuData.menu.filter(menu => menu.itemname.toLowerCase().includes(filterValue));
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
    if (this.orderData[index].qty > 0) {
      this.orderData[index].amount = this.orderData[index].qty * this.orderData[index].price;
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
    if (this.orderData.filter(item => item.itemid === this.menuData.menu[index].itemid).length === 0) {
      const item = { ...this.menuData.menu[index] };
      item['qty'] = null;
      item['amount'] = null;
      this.orderData.push(item);
    }
  }

  groupDataByCategory() {
    return this.menuData.menu.reduce((acc, obj) => {
      const key = obj['catname'];
      if (!acc[key]) {
         acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
   }, {});
  }

  addItemToOrderFromCatData(category, index) {
    if (this.orderData.filter(item => item.itemid === this.categorisedData[category][index].itemid).length === 0) {
      const item = { ...this.categorisedData[category][index] };
      item['qty'] = null;
      item['amount'] = null;
      this.orderData.push(item);
    }
  }

  discountCalculateHandler() {
    this.findGrandTotalHandler();
    if (this.discount.active && this.discount.discountvalue > 0) {
      this.totalAmount -= (this.totalAmount * (this.discount.discountvalue / 100 ));
    }
  }

}

export interface StockData {
  menu: any;
  outlet: any;
  discount: any;
}

