import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultTemplatesComponent } from './result-templates.component';

const routes: Routes = [{ path: '', component: ResultTemplatesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultTemplatesRoutingModule { }
