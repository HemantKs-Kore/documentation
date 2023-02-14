import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsageLogRoutingModule } from './usage-log-routing.module';
import { UsageLogComponent } from './usage-log.component';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';

@NgModule({
  declarations: [UsageLogComponent],
  imports: [
    CommonModule,
    UsageLogRoutingModule,
    NgbTooltipModule,
    TranslateModule,
    UseronboardingJourneyModule,
    EmptyScreenModule,
    NgbDropdownModule,
    SharedPipesModule,
  ],
})
export class UsageLogModule {}
