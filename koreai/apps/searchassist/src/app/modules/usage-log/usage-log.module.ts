import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsageLogRoutingModule } from './usage-log-routing.module';
import { UsageLogComponent } from './usage-log.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';

@NgModule({
  declarations: [UsageLogComponent],
  imports: [
    CommonModule,
    UsageLogRoutingModule,
    NgbTooltipModule,
    TranslateModule,
    UseronboardingJourneyModule,
  ],
})
export class UsageLogModule {}
