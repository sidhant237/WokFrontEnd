import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.css']
})
export class StockEntryComponent implements OnInit {


  date: any;
  outlet: string;
  employee: string;

  stockData: StockData;
  itemsData: any;

  updatingStock = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'closingstock').subscribe(
      (result: StockData) => {
        this.stockData = result;
        this.itemsData = result.Items;
        this.itemsData.forEach( item => {
          item.qty = null;
        });
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
    this.http.post(environment.url + 'closingstock', updatedStock).subscribe(
      result => {
        this.updatingStock = false;
        console.log(result);
      }, error => {
        this.updatingStock = false;
        console.log(error);
      }
    );
  }

}

export interface StockData {
  Items: any;
  Outlets: any;
  Employees: any;
}
