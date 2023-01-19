import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchExperienceRoutingModule } from './search-experience-routing.module';
import { SearchExperienceComponent } from './search-experience.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SearchExperienceComponent],
  imports: [
    CommonModule,
    SearchExperienceRoutingModule,
    PerfectScrollbarModule,
    KrModalModule,
    TranslateModule,
    UseronboardingJourneyModule,
    NgbTooltipModule,
  ],
})
export class SearchExperienceModule {}
