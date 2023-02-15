import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { UsageLogsComponent } from './usage-logs/usage-logs.component';

const routes: Routes = [
  { path: '', component: PlanDetailsComponent },
  { path: 'usageLog', component: UsageLogsComponent },
  { path: 'invoices', component: InvoicesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
