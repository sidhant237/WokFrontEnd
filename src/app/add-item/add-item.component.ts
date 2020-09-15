import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  date: any;
  name: string;
  table: any;

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
  }

  paymentEntryHandler() {
    this.updatingBill = true;
    const payload = {
      data: this.date,
      name: this.name,
      table: this.table
    };

    this.http.post(environment.url + 'cashtransfer', payload).subscribe(
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

  alertGenerateHandler(message, status) {
    this.alertMsg = message;
    this.alertStatus = status;
    this.alertActive = true;
    setTimeout(() => {
      this.alertActive = false;
    }, 5000);
  }

}
