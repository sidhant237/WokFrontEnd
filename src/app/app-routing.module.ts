import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { BillEntryComponent } from './bill-entry/bill-entry.component';
import { OutletTransferComponent } from './outlet-transfer/outlet-transfer.component';


const routes: Routes = [
  { path: '', redirectTo: 'stock-entry', pathMatch: 'full' },
  { path: 'stock-entry', component: StockEntryComponent },
  { path: 'bill-entry', component: BillEntryComponent },
  { path: 'outlet-transfer', component: OutletTransferComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
