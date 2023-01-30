import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchInsightsRoutingModule } from './search-insights-routing.module';
import { SearchInsightsComponent } from './search-insights.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { AnalyticsDropdownComponent } from '@kore.apps/helpers/components/analytics-dropdown/analytics-dropdown.component';

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
    NgxDaterangepickerMd.forRoot(),
    UseronboardingJourneyModule,
    AnalyticsDropdownComponent,
  ],
})
export class SearchInsightsModule {}
