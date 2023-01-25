import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultRankingComponent } from './result-ranking.component';

const routes: Routes = [{ path: '', component: ResultRankingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultRankingRoutingModule {}
