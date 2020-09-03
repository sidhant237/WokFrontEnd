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
          item.qty = 0;
        });
        console.log(this.itemsData);
      }, error => {
        console.log(error);
      }
    );
  }


  stockUpdateHandler() {
    this.updatingStock = true;
    const updatedStock = {};
    const employeeID = this.stockData.Employees.filter( item => item.Employee === this.employee)[0].ID;
    updatedStock['outlet'] = this.stockData.Outlets.filter( item => item.Outlet === this.outlet)[0].ID;
    updatedStock['date'] = this.date;
    updatedStock['items'] = [];
    this.itemsData.forEach(
      item => {
        updatedStock['items'].push(
          {
            'id': item.ID,
            'qty': item.qty,
            'employee': employeeID
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
