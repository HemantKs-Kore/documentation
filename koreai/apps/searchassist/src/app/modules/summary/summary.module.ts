import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    PerfectScrollbarModule,
    UseronboardingJourneyModule,
    TranslateModule,
  ],
})
export class SummaryModule {}
