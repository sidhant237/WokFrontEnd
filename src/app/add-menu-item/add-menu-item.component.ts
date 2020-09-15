import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Component({
  selector: 'app-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.css']
})
export class AddMenuItemComponent implements OnInit {

  date: any;
  name: string;
  category: any;
  price: number;

  categoryData: any;

  updatingBill = false;

  alertActive = false;
  alertMsg: string = '';
  alertStatus: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.date = new Date().toISOString().slice(0, 10);
    this.http.get(environment.url + 'addmitem').subscribe(
      (result) => {
        this.categoryData = result;
      }, error => {
        console.log(error);
      }
    );
  }

  paymentEntryHandler() {
    this.updatingBill = true;
    const payload = {
      data: this.date,
      name: this.name,
      category: this.category,
      price: this.price
    };

    this.http.post(environment.url + 'addmitem', payload).subscribe(
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