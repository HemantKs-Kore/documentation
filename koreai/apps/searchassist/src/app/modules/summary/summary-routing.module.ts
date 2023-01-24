import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { IndexPipelineDataResolver } from './services/summary-resolver.service';
import { SummaryComponent } from './summary.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryComponent,
    // resolve: [IndexPipelineDataResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryRoutingModule {}
