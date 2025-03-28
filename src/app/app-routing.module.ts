import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceGenerateComponent } from './features/invoice-generate/invoice-generate.component';

const routes: Routes = [
  { path: '', component: InvoiceGenerateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
