import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import {
  NgbTimepickerModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    FormsModule,
    UseronboardingJourneyModule,
    NgbTimepickerModule,
    NgbTooltipModule,
    NgxDaterangepickerMd,
  ],
})
export class DashboardModule {}
