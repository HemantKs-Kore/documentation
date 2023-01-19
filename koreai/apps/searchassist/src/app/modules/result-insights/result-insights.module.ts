import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultInsightsRoutingModule } from './result-insights-routing.module';
import { ResultInsightsComponent } from './result-insights.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [ResultInsightsComponent],
  imports: [
    CommonModule,
    ResultInsightsRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    SharedPipesModule,
    KrModalModule,
    FormsModule,
    NgbTooltipModule,
    UseronboardingJourneyModule,
    NgxDaterangepickerMd,
  ],
})
export class ResultInsightsModule {}
