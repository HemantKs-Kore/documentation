import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchInsightsRoutingModule } from './search-insights-routing.module';
import { SearchInsightsComponent } from './search-insights.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';

@NgModule({
  declarations: [SearchInsightsComponent],
  imports: [
    CommonModule,
    SearchInsightsRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    KrModalModule,
    SharedPipesModule,
    NgbTooltipModule,
    FormsModule,
    NgxDaterangepickerMd,
    UseronboardingJourneyModule,
  ],
})
export class SearchInsightsModule {}
