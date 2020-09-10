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
  taxableAmount: number;
  gstAmount: number;
  discountValue = 0;
  grossAmount: number;
  customDiscountIDCounter: number;
  showDiscountTab = false;

  menuData: any;
  categories: any;
  categorisedData: any;
  orderData: any = [];
  customDiscount: any = [];
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
    this.http.get(environment.url + 'order').subscribe(
      (result: StockData) => {
        this.menuData = result;
        this.customDiscountIDCounter = this.menuData.discount.length;
        this.categories = [...new Set(this.menuData.menu.map(item => item.catname))];
        this.categorisedData = this.groupDataByCategory();
        this.menuData.discount.forEach( item => {
          item['value'] = null;
        });
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


  itemOrderHandler() {
    this.updatingBill = true;
    const billStatement = {};
    billStatement['outlet'] = this.outlet;
    billStatement['items'] = [];
    billStatement['discount'] = [];
    this.orderData.forEach(
      item => {
        billStatement['items'].push(
          {
            'item': this.menuData.menu.filter(data => data.Item === item.itemName)[0].itemid,
            'qty': item.qty,
            'amount': item.amount,
            'date': this.date,
          }
        );
      }
    );
    this.menuData.discount.forEach(
      item => {
        if (item.value) {
          billStatement['discount'].push(
            {
              'item': item.discountid,
              'discountname': item.discountname,
              'qty': null,
              'amount': item.value,
              'date': this.date
            }
          );
        }
      }
    );
    this.customDiscount.forEach(
      item => {
        billStatement['discount'].push(
          {
            'item': item.id,
            'discountname': item.discountName,
            'qty': null,
            'amount': item.value,
            'date': this.date
          }
        );
      }
    );
    this.http.post(environment.url + 'order', billStatement).subscribe(
      result => {
        this.updatingBill = false;
        this.alertGenerateHandler('Order Successfull', 'success');
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
    this.findGrossAmountHandler();
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
    this.discountValue = 0;
    this.findGrossAmountHandler();
    this.menuData.discount.forEach( item => { this.discountValue += item.value; });
    this.customDiscount.forEach( item => { this.discountValue += item.value; });
    this.taxableAmount = this.grossAmount - this.discountValue;
    this.gstAmount = this.taxableAmount * 0.05;
    this.totalAmount = this.taxableAmount + this.gstAmount;
  }

  addCustomDiscountHandler() {
    this.customDiscount.push({
      id: this.customDiscountIDCounter + 1,
      discountName: null,
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
    this.menuData.discount.forEach( item => { item.value = null; });
  }

}

export interface StockData {
  menu: any;
  outlet: any;
  discount: any;
}

