import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultInsightsComponent } from './result-insights.component';

const routes: Routes = [{ path: '', component: ResultInsightsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultInsightsRoutingModule {}
