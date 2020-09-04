import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-bill-entry',
  templateUrl: './bill-entry.component.html',
  styleUrls: ['./bill-entry.component.css']
})
export class BillEntryComponent implements OnInit {

  date: any;
  outlet: string;
  employee: string;
  supplier: string;
  payment: string;
  billNumber: string;
  totalAmount: number;

  itemsData: any;
  billData: any = [];

  updatingBill = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.totalAmount = 0;
    this.http.get(environment.url + 'billentry').subscribe(
      (result: StockData) => {
        this.itemsData = result;
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
    billStatement['bill_number'] = this.billNumber;
    billStatement['items'] = [];
    this.billData.forEach(
      item => {
        billStatement['items'].push(
          {
            'item': this.itemsData.Items.filter(data => data.Item === item.itemName)[0].ID,
            'qty': item.qty,
            'amount': item.amount,
            'employee': this.employee,
            'date': this.date,
            'supplier' : this.supplier,
            'payment' : this.payment
          }
        );
      }
    );
    this.http.post(environment.url + 'billentry', billStatement).subscribe(
      result => {
        this.updatingBill = false;
        this.openSnackBar('Bill Generated Successfully', 'success');
      }, error => {
        this.updatingBill = false;
        console.log(error);
        this.openSnackBar(error.error.msg, 'error');
      }
    );
  }

  billItemInsertHandler() {
    this.billData.push({
      'itemName': '',
      'qty': null,
      'rate': null,
      'amount': 0
    });
  }

  billItemRemoveHandler(index) {
    this.billData.splice(index, 1);
  }

  billCalculatorHandler(index) {
    if (this.billData[index].qty && this.billData[index].rate) {
      this.billData[index].amount = this.billData[index].qty * this.billData[index].rate;
    }
    this.totalAmount = 0;
    this.billData.forEach( item => {
      this.totalAmount += item.amount;
    });
  }

  openSnackBar(msg, status) {
    this._snackBar.open(msg, status, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [status]
    });
  }

}

export interface StockData {
  Items: any;
  Outlets: any;
  Employees: any;
  Suppliers: any;
  PayTerms: any;
}

