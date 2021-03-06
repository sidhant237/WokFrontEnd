import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { BillEntryComponent } from './bill-entry/bill-entry.component';
import { OutletTransferComponent } from './outlet-transfer/outlet-transfer.component';
import { AlertComponent } from './shared/alert/alert.component';
import { OrderItemComponent } from './order-item/order-item.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { OrderHazraComponent } from './order-hazra/order-hazra.component';
import { PaymentEntryComponent } from './payment-entry/payment-entry.component';
import { CashTransferComponent } from './cash-transfer/cash-transfer.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddMenuItemComponent } from './add-menu-item/add-menu-item.component';

@NgModule({
  declarations: [
    AppComponent,
    StockEntryComponent,
    SpinnerComponent,
    BillEntryComponent,
    OutletTransferComponent,
    AlertComponent,
    OrderItemComponent,
    OrderHazraComponent,
    PaymentEntryComponent,
    CashTransferComponent,
    AddItemComponent,
    AddMenuItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
