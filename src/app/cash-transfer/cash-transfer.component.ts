import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-cash-transfer',
  templateUrl: './cash-transfer.component.html',
  styleUrls: ['./cash-transfer.component.css']
})
export class CashTransferComponent implements OnInit {

  date: any;
  amount: number;
  employee: any;

  employeeData: any;

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'cashtransfer').subscribe(
      (result) => {
        this.employeeData = result;
      }, error => {
        console.log(error);
      }
    );
  }

  paymentEntryHandler() {
    this.updatingBill = true;
    const payload = {
      data: this.date,
      amount: this.amount,
      employee: this.employee
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
