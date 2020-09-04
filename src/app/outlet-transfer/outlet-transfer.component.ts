import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-outlet-transfer',
  templateUrl: './outlet-transfer.component.html',
  styleUrls: ['./outlet-transfer.component.css']
})
export class OutletTransferComponent implements OnInit {
  date: any;
  fromOutlet: string;
  toOutlet: string;
  employee: string;

  itemsData: any;
  transferData: any = [];

  transferingStock = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'transfer').subscribe(
      (result: StockTransferData) => {
        this.itemsData = result;
      }, error => {
        console.log(error);
      }
    );
  }


  stockTransferHandler() {
    this.transferingStock = true;
    const stockTransferData = {};
    stockTransferData['from_outlet'] = this.fromOutlet;
    stockTransferData['to_outlet'] = this.toOutlet;
    stockTransferData['items'] = [];
    this.transferData.forEach(
      item => {
        stockTransferData['items'].push(
          {
            'item': this.itemsData.Items.filter(data => data.Item === item.itemName)[0].ID,
            'qty': item.qty,
            'employee': this.employee,
            'date': this.date
          }
        );
      }
    );
    this.http.post(environment.url + 'transfer', stockTransferData).subscribe(
      result => {
        this.transferingStock = false;
        this.alertGenerateHandler('Bill Generated Successfully', 'success');
      }, error => {
        this.transferingStock = false;
        console.log(error);
        this.alertGenerateHandler('something went wrong', 'error');
      }
    );
  }

  ItemInsertHandler() {
    this.transferData.push({
      'itemName': '',
      'qty': null
    });
  }

  itemRemoveHandler(index) {
    this.transferData.splice(index, 1);
  }

  alertGenerateHandler(message, status) {
    this.alertMsg = message;
    this.alertStatus = status;
    this.alertActive = true;
    setTimeout(() => {
      this.alertActive = false;
    }, 5000);
  }

}

export interface StockTransferData {
  Items: any;
  Outlets: any;
  Employees: any;
}
