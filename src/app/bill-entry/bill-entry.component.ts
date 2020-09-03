import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  itemsData: any;
  billData: any = [];

  updatingStock = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'billentry').subscribe(
      (result: StockData) => {
        this.itemsData = result;
      }, error => {
        console.log(error);
      }
    );
  }


  stockUpdateHandler() {
    this.updatingStock = true;
    const updatedStock = {};
    updatedStock['outlet'] = this.outlet;
    updatedStock['items'] = [];
    this.itemsData.filter(item => item.qty !== null).forEach(
      item => {
        updatedStock['items'].push(
          {
            'id': item.ID,
            'qty': item.qty,
            'employee': this.employee,
            'date': this.date
          }
        );
      }
    );
    this.http.post(environment.url + 'billentry', updatedStock).subscribe(
      result => {
        this.updatingStock = false;
        console.log(result);
      }, error => {
        this.updatingStock = false;
        console.log(error);
      }
    );
  }

  billItemInsertHandler() {
    this.billData.push({
      'itemName': '',
      'qty': 0,
      'rate': 0,
      'amount': 0
    });
  }

  billItemRemoveHandler(index) {
    this.billData.splice(index, 1);
    console.log(this.billData);
  }

}

export interface StockData {
  Items: any;
  Outlets: any;
  Employees: any;
  Suppliers: any;
  PayTerms: any;
}

