import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsageLogRoutingModule } from './usage-log-routing.module';
import { UsageLogComponent } from './usage-log.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

@NgModule({
  declarations: [UsageLogComponent],
  imports: [
    CommonModule,
    UsageLogRoutingModule,
    NgbTooltipModule,
    TranslateModule,
    UseronboardingJourneyModule,
    EmptyScreenModule,
  ],
})
export class UsageLogModule {}
