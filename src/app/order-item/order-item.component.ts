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
  orderNumber: string;
  totalAmount: number;
  taxableAmount: number;
  gstAmount: number;
  discountValue = 0;
  grossAmount: number;
  customDiscountIDCounter: number;
  showDiscountTab = false;
  orderMethod: any;
  payMethod: any;

  menuData: any;
  categories: any;
  categorisedData: any;
  orderData: any = [];
  customDiscount: any = [];
  discountData: any = [];
  gstData: any = [];
  isDiscountApplied = false;

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
    this.getItemList();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  getItemList() {
    this.orderData = [];
    this.http.get(environment.url + 'tollyorder').subscribe(
      (result: StockData) => {
        this.menuData = result;
        this.payMethod = this.menuData.PayMethod.filter(item => item.PayMethodName.toLowerCase() === 'online')[0].PayMethodID;
        this.customDiscountIDCounter = this.menuData.discount.length;
        this.categories = [...new Set(this.menuData.menu.map(item => item.catname))];
        this.categorisedData = this.groupDataByCategory();
      }, error => {
        console.log(error);
      }
    );
  }


  _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.menuData.menu.filter(menu => menu.itemname.toLowerCase().includes(filterValue));
  }


  itemOrderHandler() {
    this.updatingBill = true;
    const billStatement = {};
    billStatement['date'] = this.date;
    billStatement['order_method'] = this.orderData;
    billStatement['paymethod_method'] = this.payMethod;
    billStatement['amount'] = this.totalAmount;
    billStatement['items'] = [];
    this.orderData.forEach(
      item => {
        billStatement['items'].push(
          {
            'item': item.itemid,
            'qty': item.qty,
            'amount': item.amount,
            'date': this.date,
            'order_number': this.menuData.OrderNo[0]['1'],
            'pay_method': this.payMethod,
            'order_method': this.orderData
          }
        );
      }
    );
    this.customDiscount.forEach(
      item => {
        billStatement['items'].push(
          {
            'item': item.discountid,
            'qty': 0,
            'amount': item.value,
            'date': this.date,
            'order_number': this.menuData.OrderNo[0]['1']
          }
        );
      }
    );
    billStatement['items'].push(
      {
        'item': this.categorisedData.GST[0].itemid,
        'qty': 0,
        'amount': this.gstAmount,
        'date': this.date,
        'order_number': this.menuData.OrderNo[0]['1']
      }
    );
    this.http.post(environment.url + 'tollyorder', billStatement).subscribe(
      result => {
        this.updatingBill = false;
        this.alertGenerateHandler('Order Successfull', 'success');
        this.getItemList();
      }, error => {
        this.updatingBill = false;
        console.log(error);
        this.alertGenerateHandler('something went wrong', 'error');
      }
    );
  }

  billItemInsertHandler() {
    this.orderData.push({
      'itemName': null,
      'qty': null,
      'rate': null,
      'amount': 0
    });
  }

  billItemRemoveHandler(index) {
    this.orderData.splice(index, 1);
    if (this.discountValue) {
      this.discountCalculateHandler();
    } else  {
      this.findGrossAmountHandler();
    }
  }

  billCalculatorHandler(index) {
    this.orderData[index].amount = this.orderData[index].qty * this.orderData[index].price;
    if (this.discountValue) {
      this.discountCalculateHandler();
    } else  {
      this.findGrossAmountHandler();
    }
  }

  findGrossAmountHandler() {
    this.grossAmount = 0;
    this.orderData.forEach( item => {
      this.grossAmount += item.amount;
    });
    this.taxableAmount = this.grossAmount;
    this.gstAmount = this.taxableAmount * 0.05;
    this.totalAmount = this.taxableAmount + this.gstAmount;
  }

  alertGenerateHandler(message, status) {
    this.alertMsg = message;
    this.alertStatus = status;
    this.alertActive = true;
    setTimeout(() => {
      this.alertActive = false;
    }, 5000);
  }

  // add item from search field
  addItemToOrder(index) {
    if (this.orderData.filter(item => item.itemid === this.menuData.menu[index].itemid).length === 0) {
      const item = { ...this.menuData.menu[index] };
      console.log(item);
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

  // add item from list
  addItemToOrderFromCatData(category, index) {
    if (this.orderData.filter(item => item.itemid === this.categorisedData[category][index].itemid).length === 0) {
      const item = { ...this.categorisedData[category][index] };
      item['qty'] = null;
      item['amount'] = null;
      this.orderData.push(item);
    }
  }

  discountCalculateHandler() {
    this.discountValue = 0;
    this.findGrossAmountHandler();
    this.customDiscount.forEach( item => { this.discountValue += item.value; });
    this.taxableAmount = this.grossAmount - this.discountValue;
    this.gstAmount = this.taxableAmount * 0.05;
    this.totalAmount = this.taxableAmount + this.gstAmount;
  }

  addCustomDiscountHandler() {
    this.customDiscount.push({
      discountid: null,
      value: null
    });
  }

  removeCustomDiscountHandler(index) {
    this.customDiscount.splice(index, 1);
    this.discountCalculateHandler();
  }

  resetDiscount() {
    this.discountValue = 0;
    this.customDiscount = [];
    this.findGrossAmountHandler();
  }

}

export interface StockData {
  menu: any;
  outlet: any;
  discount: any;
  OrderNo: any;
}

