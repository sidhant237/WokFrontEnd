import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-payment-entry',
  templateUrl: './payment-entry.component.html',
  styleUrls: ['./payment-entry.component.css']
})
export class PaymentEntryComponent implements OnInit {

  date: any;
  amount: number;
  supplier: any;
  paymentMethod = 1;
  paymentData: any;

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'payment').subscribe(
      (result: Payment) => {
        this.paymentData = result;
      }, error => {
        console.log(error);
      }
    );
  }

  paymentEntryHandler() {
    this.updatingBill = true;
    const payload = {
      data: this.date,
      supplier: this.supplier,
      amount: this.amount,
      payMethod: this.paymentMethod
    };

    this.http.post(environment.url + 'payment', payload).subscribe(
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

interface Payment {
  Supplier: any;
  Paymethod: any;
}
