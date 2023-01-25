import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchInsightsComponent } from './search-insights.component';

const routes: Routes = [{ path: '', component: SearchInsightsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchInsightsRoutingModule {}
