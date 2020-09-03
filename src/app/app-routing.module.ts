import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockEntryComponent } from './stock-entry/stock-entry.component';


const routes: Routes = [
  { path: '', redirectTo: 'stock-entry', pathMatch: 'full' },
  { path: 'stock-entry', component: StockEntryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
