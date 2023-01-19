import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEngagementRoutingModule } from './user-engagement-routing.module';
import { UserEngagementComponent } from './user-engagement.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';

@NgModule({
  declarations: [UserEngagementComponent],
  imports: [
    CommonModule,
    UserEngagementRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    FormsModule,
    NgxDaterangepickerMd,
    NgbTooltipModule,
    UseronboardingJourneyModule,
  ],
})
export class UserEngagementModule {}
