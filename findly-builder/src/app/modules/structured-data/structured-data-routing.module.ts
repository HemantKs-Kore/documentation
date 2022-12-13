import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StructuredDataComponent } from './structured-data.component';

const routes: Routes = [{ path: '', component: StructuredDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuredDataRoutingModule { }
