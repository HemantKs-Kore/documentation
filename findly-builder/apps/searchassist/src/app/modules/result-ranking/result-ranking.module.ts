import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRankingRoutingModule } from './result-ranking-routing.module';
import { ResultRankingComponent } from './result-ranking.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [ResultRankingComponent],
  imports: [
    CommonModule,
    ResultRankingRoutingModule,
    TranslateModule,
    NgbTooltipModule,
    EmptyScreenModule,
    SharedPipesModule,
    PerfectScrollbarModule,
  ],
})
export class ResultRankingModule {}
