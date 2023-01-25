import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRankingRoutingModule } from './result-ranking-routing.module';
import { ResultRankingComponent } from './result-ranking.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ResultRankingComponent],
  imports: [
    CommonModule,
    ResultRankingRoutingModule,
    TranslateModule,
    NgbTooltipModule,
  ],
})
export class ResultRankingModule {}
