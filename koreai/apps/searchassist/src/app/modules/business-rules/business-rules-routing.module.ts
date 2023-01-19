import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessRulesComponent } from './business-rules.component';

const routes: Routes = [{ path: '', component: BusinessRulesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRulesRoutingModule { }
